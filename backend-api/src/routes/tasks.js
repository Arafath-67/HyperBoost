const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // আগের auth middleware
const { getTasks, completeTask, createTask } = require('../controllers/taskController');

// ১. কাজ দেখার রাউট
router.get('/list', protect, getTasks);

// ২. কাজ জমা দেওয়ার রাউট
router.post('/complete', protect, completeTask);

// ৩. নতুন কাজ তৈরি (শুধুমাত্র এডমিনের জন্য - পরে আলাদা এডমিন চেক লাগবে)
router.post('/create', protect, createTask); 

module.exports = router;