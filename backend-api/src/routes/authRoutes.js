const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // 🔥 রেট লিমিট ইমপোর্ট

const { 
    registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, 
    sendOtp, verifyOtp, resetPasswordWithOtp,
    getMe, updateDetails, getLeaderboard,
    requestAdminAccess, verifyAdminAccess // 🔥 নতুন ফাংশনগুলো ইমপোর্ট
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

// 🔥 Anti-Brute Force Limiter (১০ মিনিটে ৫ বারের বেশি ভুল করলে ব্লক)
const bruteForceBlocker = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: "Too many attempts! You are blocked for 10 mins." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ১. রেজিস্ট্রেশন ও লগইন
router.post('/register', registerUser);
router.post('/login', loginUser);

// ২. ইমেইল ভেরিফিকেশন
router.put('/verify/:token', verifyEmail);

// ৩. প্রোফাইল ডাটা
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

// ৪. পাসওয়ার্ড রিকভারি
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// ৫. সাধারণ OTP সিস্টেম
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password-otp', resetPasswordWithOtp);

// ৬. লিডারবোর্ড
router.get('/leaderboard', protect, getLeaderboard);

// 🔥 ৭. অ্যাডমিন প্যানেল সিকিউরিটি রাউট
router.get('/request-admin-otp', protect, requestAdminAccess);
// 👇 এখানে 'bruteForceBlocker' বসানো হলো যাতে হ্যাকার আটকায়
router.post('/verify-admin-otp', protect, bruteForceBlocker, verifyAdminAccess); 

module.exports = router;