const express = require('express');
const router = express.Router();
const { depositRequest, getMyTransactions, approveTransaction } = require('../controllers/paymentController'); // approveTransaction যোগ করুন
const { protect, admin } = require('../middlewares/authMiddleware'); // admin middleware লাগবে

router.post('/deposit', protect, depositRequest);
router.get('/history', protect, getMyTransactions);

// 🔥 অ্যাডমিন রাউট
router.post('/approve', protect, admin, approveTransaction); 

module.exports = router;