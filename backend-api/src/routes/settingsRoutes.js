const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

// TODO: পরে এখানে Admin Middleware বসাতে হবে যাতে অন্য কেউ এক্সেস না পায়
// আপাতত ডেভেলপিং এর জন্য ওপেন রাখছি
router.get('/', getSettings);
router.put('/update', updateSettings);

module.exports = router;