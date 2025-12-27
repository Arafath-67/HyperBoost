const express = require('express');
const router = express.Router();

// কন্ট্রোলার ইমপোর্ট (🔥 এখানে getDashboardStats যোগ করা হলো)
const { getAllUsers, toggleBanUser, getDashboardStats } = require('../controllers/adminController');

// সিকিউরিটি ইমপোর্ট
const { protect, admin } = require('../middlewares/authMiddleware');

// 🔥 ১. নতুন: ড্যাশবোর্ড স্ট্যাটস দেখার রাস্তা (Overview Page এর জন্য)
router.get('/stats', protect, admin, getDashboardStats);

// ২. সব ইউজার দেখার রাস্তা (আপনার আগের কোড)
router.get('/users', protect, admin, getAllUsers);

// ৩. ইউজার ব্যান করার রাস্তা (আপনার আগের কোড)
router.put('/users/ban/:id', protect, admin, toggleBanUser);

module.exports = router;