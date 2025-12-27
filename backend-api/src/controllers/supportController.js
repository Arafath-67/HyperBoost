const Ticket = require('../models/Ticket');

// ১. নতুন টিকিট বা রিপোর্ট জমা দেওয়া
exports.createTicket = async (req, res) => {
    try {
        const { type, subject, message, reportedEntity } = req.body;

        const ticket = await Ticket.create({
            user: req.user.id,
            type, // 'support' or 'report'
            subject,
            message,
            reportedEntity
        });

        res.status(201).json({ success: true, message: 'Ticket submitted successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ২. নিজের টিকিটগুলো দেখা (User History)
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};