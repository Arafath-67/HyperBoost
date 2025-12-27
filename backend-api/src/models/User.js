const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // ১. সাধারণ তথ্য
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // ২. ইকোনমি সিস্টেম
    points: { type: Number, default: 50 },
    totalEarnedPoints: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },

    // ৩. প্রিমিয়াম মেম্বারশিপ ও লিমিট
    isPremium: { type: Boolean, default: false },
    
    // আপনার আগের membershipLevel ফিল্ড (কন্ট্রোলারে plan এর বদলে এটা ব্যবহার করা যাবে)
    membershipLevel: { 
        type: String, 
        enum: ['free', 'silver', 'gold'], 
        default: 'free' 
    },
    // 🔥 আমি শুধু এই একটা লাইন যোগ করলাম (যাতে কন্ট্রোলারের plan কোড কাজ করে)
    plan: { type: String, enum: ['free', 'silver', 'gold'], default: 'free' }, 
    
    premiumExpiry: { type: Date },

    // 🔥🔥 NEW: Daily Task Tracking (লিমিট চেক করার জন্য শুধু এই ২টা লাইন জরুরি)
    dailyTaskCount: { type: Number, default: 0 },
    lastTaskDate: { type: Date, default: Date.now },

    // ৪. ভেরিফিকেশন ও রেফারেল (আপনার আগের সব কোড আছে)
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // ৫. স্ট্রিক ও পাসওয়ার্ড রিসেট
    streak: {
        count: { type: Number, default: 0 },
        lastLogin: { type: Date }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ৬. সাধারণ OTP
    otp: String,
    otpExpire: Date,

    // ৭. অ্যাডমিন সিকিউরিটি OTP
    loginOTP: { type: String }, 
    otpAttempts: { type: Number, default: 0 },

    // ৮. সিকিউরিটি
    security: {
        deviceFingerprint: { type: String, select: false },
        ipHistory: [String],
        riskScore: { type: Number, default: 0 },
        isBanned: { type: Boolean, default: false },
        shadowBanned: { type: Boolean, default: false }
    },
    appVersion: { type: String, default: '1.0.0' }

}, { timestamps: true });

// 🔥 আপনার আগের পাসওয়ার্ড এনক্রিপশন লজিক (যা ছিল তাই আছে)
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);