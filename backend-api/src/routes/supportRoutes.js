const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets } = require('../controllers/supportController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, createTicket);
router.get('/my', protect, getMyTickets);

module.exports = router;