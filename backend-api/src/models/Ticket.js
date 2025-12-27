const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['support', 'report'], required: true }, // সাপোর্ট নাকি রিপোর্ট
    subject: { type: String, required: true },
    message: { type: String, required: true },
    
    // যদি রিপোর্ট হয়, তবে কার বিরুদ্ধে?
    reportedEntity: { type: String }, // Channel URL or User ID
    
    status: { 
        type: String, 
        enum: ['open', 'investigating', 'resolved', 'closed'], 
        default: 'open' 
    },
    adminResponse: { type: String } // অ্যাডমিন কী রিপ্লাই দিল

}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);