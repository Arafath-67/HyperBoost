const express = require('express');
const router = express.Router();
const { createCampaign, getMyCampaigns } = require('../controllers/campaignController');
const { protect } = require('../middlewares/authMiddleware'); // গার্ড

// ১. ক্যাম্পেইন তৈরির রাস্তা (POST)
router.post('/create', protect, createCampaign);

// ২. নিজের ক্যাম্পেইন দেখার রাস্তা (GET)
router.get('/my', protect, getMyCampaigns);

module.exports = router;