const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer'); 
const dns = require('dns'); // 🔥 নতুন: ডোমেইন চেক করার জন্য মডিউল

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ২. রেজিস্ট্রেশন (Advanced Domain Check সহ)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, deviceFingerprint, referralCode } = req.body;

        if (!username || !email || !password || !deviceFingerprint) {
            return res.status(400).json({ message: 'সব তথ্য এবং ডিভাইস আইডি দিতে হবে!' });
        }

        // 🔥 ১. ডোমেইন ভ্যালিডেশন (DNS MX Check) - ভুয়া ইমেইল আটকানোর জন্য 🔥
        const domain = email.split('@')[1]; 
        
        const isValidDomain = await new Promise((resolve) => {
            dns.resolveMx(domain, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                    resolve(false); // ডোমেইন পাওয়া যায়নি
                } else {
                    resolve(true); // ডোমেইন ভ্যালিড
                }
            });
        });

        if (!isValidDomain) {
            return res.status(400).json({ 
                success: false, 
                message: "This email domain does not exist! Please use a valid email provider." 
            });
        }
        // 🔥 ডোমেইন চেকিং শেষ 🔥

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'এই ইমেইল আগেই ব্যবহার হয়েছে।' });

        if (email.includes('tempmail') || email.includes('yopmail')) {
            return res.status(400).json({ message: 'Temporary ইমেইল নিষিদ্ধ।' });
        }

        let startingPoints = 50;
        let referrerId = null;

        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                referrer.points += 500;
                referrer.totalEarnedPoints += 500;
                await referrer.save();
                startingPoints += 100;
                referrerId = referrer._id;
            }
        }

        const verifyToken = crypto.randomBytes(20).toString('hex');
        const verifyTokenHash = crypto.createHash('sha256').update(verifyToken).digest('hex');
        
        const newUserReferralCode = username.toLowerCase().replace(/\s/g, '') + Math.floor(1000 + Math.random() * 9000);

        // 🔥 FIX: ম্যানুয়াল হ্যাশ বাদ দেওয়া হয়েছে (User.js অটোমেটিক করবে)
        const user = await User.create({
            username,
            email,
            password: password, 
            points: startingPoints,
            referralCode: newUserReferralCode,
            referredBy: referrerId,
            security: { deviceFingerprint, riskScore: 0 },
            isVerified: false, 
            verificationToken: verifyTokenHash
        });

        const verifyUrl = `http://localhost:3000/auth/verify/${verifyToken}`;
        const message = `Welcome to HyperBoost! Click here to activate account: \n\n ${verifyUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Account Activation',
                message,
                url: verifyUrl
            });
            res.status(201).json({ success: true, message: `Account created! Check email ${email} to verify.` });
        } catch (err) {
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: "Email could not be sent. Try again." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৩. ইমেইল ভেরিফাই
exports.verifyEmail = async (req, res) => {
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ verificationToken: token });

        if (!user) return res.status(400).json({ message: "Invalid Token" });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Email Verified!", token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৪. লগইন
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // ব্যান চেক
            if (user.security && user.security.isBanned) {
                return res.status(403).json({ success: false, message: 'Your account has been suspended! Please contact support.' });
            }

            // ইমেইল ভেরিফিকেশন চেক
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first!' });
            }

            const today = new Date();
            const lastLogin = user.streak.lastLogin ? new Date(user.streak.lastLogin) : null;
            
            if (lastLogin) {
                const diffTime = Math.abs(today - lastLogin);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays === 1) user.streak.count += 1;
                else if (diffDays > 1) user.streak.count = 1;
            } else {
                user.streak.count = 1;
            }
            
            user.streak.lastLogin = today;
            await user.save();

            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                points: user.points,
                streak: user.streak.count,
                isPremium: user.isPremium,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৫. পাসওয়ার্ড ভুলে গেছি
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;
        const message = `Reset your password here: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message,
                url: resetUrl
            });
            res.status(200).json({ success: true, message: "Email sent successfully!" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: "Email sent failed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৬. পাসওয়ার্ড রিসেট (লিংক দিয়ে)
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Expired Token" });
        }

        user.password = req.body.password;
        
        // 🔥 FIX: পাসওয়ার্ড রিসেট করলে অটোমেটিক ভেরিফাই হবে
        user.isVerified = true; 

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password Reset Successful! Login Now." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৭. OTP পাঠানো
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const message = `Your Security Code is: ${otp}`;

        await sendEmail({
            email: user.email,
            subject: 'HyperBoost Security Code',
            message
        });

        res.status(200).json({ success: true, message: "OTP sent to email!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৮. OTP ভেরিফাই
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        res.status(200).json({ success: true, message: "OTP Verified! Proceed to reset password." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৯. ফাইনাল পাসওয়ার্ড রিসেট (OTP দিয়ে) - FIXED & AUTO VERIFY
exports.resetPasswordWithOtp = async (req, res) => {
    try {
        let { email, otp, password } = req.body; 
        password = password.trim(); 

        const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid Request or Expired OTP" });
        }

        user.password = password; // User.js হ্যাশ করবে
        
        // 🔥 FIX: পাসওয়ার্ড রিসেট করলে অটোমেটিক ভেরিফাই হবে
        user.isVerified = true; 
        
        user.otp = undefined;
        user.otpExpire = undefined;
        
        await user.save();

        res.status(200).json({ success: true, message: "Password Reset Successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server Error during password reset" });
    }
};

// ১০. ইউজার প্রোফাইল
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ১১. আপডেট
exports.updateDetails = async (req, res) => {
    try {
        const { username, email } = req.body;
        const fieldsToUpdate = {};
        if (username) fieldsToUpdate.username = username;
        if (email) fieldsToUpdate.email = email;

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true }).select('-password');

        res.status(200).json({ success: true, message: "Profile Updated!", user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update Failed' });
    }
};

// ১২. লিডারবোর্ড
exports.getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({ totalEarnedPoints: { $gt: 0 } })
            .sort({ totalEarnedPoints: -1 })
            .limit(20)
            .select('username points totalEarnedPoints isPremium membershipLevel avatar'); 
        res.json({ success: true, leaderboard: topUsers });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ১৩. অ্যাডমিন OTP রিকোয়েস্ট
exports.requestAdminAccess = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.loginOTP = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; 
        user.otpAttempts = 0; 
        await user.save({ validateBeforeSave: false });

        await transporter.sendMail({
            from: `"HyperBoost Admin" <${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: '🔐 Admin Panel Access Code',
            html: `<h1>${otp}</h1>`
        });

        res.status(200).json({ success: true, message: "OTP sent to your email!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
};

// ১৪. অ্যাডমিন OTP ভেরিফাই
exports.verifyAdminAccess = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User session not found" });

        if (!user.loginOTP || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired. Request a new one." });
        }

        if (user.loginOTP !== otp) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            await user.save({ validateBeforeSave: false });
            return res.status(400).json({ success: false, message: "Invalid Code!" });
        }

        user.loginOTP = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: "Access Granted ✅" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};