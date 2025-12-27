const mongoose = require('mongoose');

const taskLogSchema = new mongoose.Schema({
    // ১. কে কাজটি করল
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 🔥 হাইব্রিড সিস্টেম: ক্যাম্পেইন অথবা টাস্ক, যেকোনো একটি থাকবে
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign', 
        required: false // ইউজারদের দেওয়া কাজের জন্য
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', 
        required: false // এডমিনের দেওয়া কাজের জন্য
    },

    // ২. কাজের ধরণ
    platform: { type: String, required: true }, 
    actionType: { type: String, required: true },
    pointsEarned: { type: Number, required: true },

    // ৩. সিকিউরিটি
    verificationMethod: {
        type: String,
        enum: ['webview_injection', 'extension', 'api_check', 'manual'],
        required: true
    },
    
    // ৪. বট ডিটেকশন
    timeTaken: { type: Number, required: true }, 
    deviceInfo: { type: String }, 
    ipAddress: { type: String },

    // ৫. স্ট্যাটাস
    status: {
        type: String,
        enum: ['success', 'failed', 'flagged', 'reverted'],
        default: 'success'
    },
    
    securityNote: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('TaskLog', taskLogSchema);