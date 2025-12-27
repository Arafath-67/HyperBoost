const express = require('express');
const router = express.Router();
const { getTasks, completeTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware'); // গার্ড ইম্পোর্ট করলাম

// ১. টাস্ক পাওয়ার রাস্তা (GET)
// গার্ড (protect) চেক করবে, তারপর টাস্ক দেবে
router.get('/get', protect, getTasks);

// ২. টাস্ক জমা দেওয়ার রাস্তা (POST)
router.post('/complete', protect, completeTask);

module.exports = router;