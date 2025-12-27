const mongoose = require('mongoose');

// সাব-সার্ভিস স্কিমা (যেমন: শুধু Views বা Subscribe)
const subServiceSchema = new mongoose.Schema({
    isEnabled: { type: Boolean, default: true }, // চালু বা বন্ধ
    notice: { type: String, default: 'This service is currently under maintenance.' } // অফ থাকলে কি দেখাবে
}, { _id: false });

// প্ল্যাটফর্ম স্কিমা (যেমন: পুরো YouTube)
const platformSchema = new mongoose.Schema({
    isEnabled: { type: Boolean, default: true }, // মাস্টার সুইচ
    services: {
        // এখানে আপনার সব সার্ভিস টাইপ থাকবে
        subscribe: { type: Boolean, default: true },
        views: { type: Boolean, default: true },
        likes: { type: Boolean, default: true },
        followers: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        share: { type: Boolean, default: true }
    }
}, { _id: false });

const PlatformSettingsSchema = new mongoose.Schema({
    // ১. সোশ্যাল মিডিয়া কন্ট্রোল
    platforms: {
        youtube: { type: platformSchema, default: () => ({}) },
        facebook: { type: platformSchema, default: () => ({}) },
        instagram: { type: platformSchema, default: () => ({}) },
        tiktok: { type: platformSchema, default: () => ({}) }
    },

    // ২. ট্রানজেকশন কন্ট্রোল
    transactions: {
        allowDeposits: { type: Boolean, default: true }, // ডিপোজিট অন/অফ
        bkashNumber: { type: String, default: '01xxxxxxxxx' },
        nagadNumber: { type: String, default: '01xxxxxxxxx' },
        exchangeRate: { type: Number, default: 100 } // ১ টাকা = কত পয়েন্ট
    },

    // ৩. গ্লোবাল অ্যাপ কন্ট্রোল
    system: {
        maintenanceMode: { type: Boolean, default: false }, // পুরো সাইট অফ
        allowRegistration: { type: Boolean, default: true }, // নতুন ইউজার অফ
        noticeBoard: { type: String, default: '' } // হোমপেজে নোটিশ দেখানোর জন্য
    }

}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', PlatformSettingsSchema);