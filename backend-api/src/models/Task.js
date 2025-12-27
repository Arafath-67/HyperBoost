const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // ১. টাস্কের নাম বা টাইটেল (যেমন: Watch this video)
    title: {
        type: String,
        required: true,
        trim: true
    },

    // ২. প্ল্যাটফর্ম (ছোট হাতের অক্ষর হতে হবে, কারণ ফ্রন্টএন্ড youtube পাঠায়)
    platform: {
        type: String,
        required: true,
        enum: ['youtube', 'facebook', 'instagram', 'tiktok', 'website'], 
        lowercase: true 
    },

    // ৩. কাজের ধরন (Subscribe, Follow, View etc.)
    actionType: {
        type: String,
        required: true,
        enum: ['subscribe', 'follow', 'like', 'view', 'comment']
    },

    // ৪. লিংক (ফ্রন্টএন্ড targetUrl পাঠায়, তাই এটাই রাখতে হবে)
    targetUrl: {
        type: String,
        required: true
    },

    // ৫. পয়েন্ট রিওয়ার্ড (ফ্রন্টএন্ড pointsReward বা cpc পাঠায়)
    pointsReward: {
        type: Number,
        required: true,
        default: 10
    },

    // ৬. টাইমার (কতক্ষণ দেখতে হবে)
    timeRequired: { 
        type: Number, 
        default: 60 
    },

    // ৭. কোয়ান্টিটি (কতজন ইউজার দরকার)
    targetQuantity: {
        type: Number,
        default: 0 // 0 মানে আনলিমিটেড বা সেট করা হয়নি
    },

    // ৮. কতজন কাজটা শেষ করেছে
    completedCount: {
        type: Number,
        default: 0
    },

    // ৯. এটা কি অ্যাডমিনের অফিসিয়াল টাস্ক? (Premium Logic এর জন্য জরুরি)
    isOfficial: {
        type: Boolean,
        default: false
    },
    
    // ১০. ক্যাটাগরি (Official নাকি Community)
    category: {
        type: String,
        enum: ['official', 'community'],
        default: 'community'
    },

    // ১১. স্ট্যাটাস (অ্যাডমিন রিজেক্ট করলে rejected হবে)
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'rejected', 'pending'],
        default: 'active'
    },

    // ১২. কে তৈরি করেছে (ইউজার নাকি অ্যাডমিন)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);