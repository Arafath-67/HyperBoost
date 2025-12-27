const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // ক্যাটাগরি (আগের এবং নতুন সব সাপোর্ট করবে)
    category: {
        type: String,
        enum: ['point_pack', 'service', 'membership', 'deposit'], 
        default: 'point_pack' 
    },

    // পেমেন্ট মেথড
    paymentMethod: {
        type: String,
        // 🔥 UPDATE: এখানে 'mobile' অ্যাড করা হয়েছে কারণ নতুন ফ্রন্টএন্ড 'mobile' পাঠায়
        // আগের 'bkash', 'nagad' ও রাখা হয়েছে যাতে পুরোনো ডাটা না হারায়
        enum: ['bkash', 'nagad', 'rocket', 'binance', 'card', 'mobile'], 
        required: true 
    },

    // 🔥 NEW FIELD: নতুন ওয়ালেট পেজের জন্য (bkash/nagad আলাদা করার জন্য)
    mobileGateway: {
        type: String,
        enum: ['bkash', 'nagad', 'rocket', '', null],
        default: ''
    },

    transactionId: { 
        type: String,
        required: true,
        unique: true
    },
    
    amount: { type: Number, required: true },

    // ✅ আগের ফিচার: টাকা দিয়ে পয়েন্ট কিনলে এটাতে ভ্যালু থাকবে
    pointsAmount: { type: Number, default: 0 }, 

    // ✅ নতুন ফিচার: সার্ভিস বা মেম্বারশিপ কিনলে এটাতে ডিটেইলস থাকবে
    orderDetails: {
        platform: String,     // youtube, facebook
        serviceType: String,  // subscribe (আগের জন্য)
        serviceId: String,    // 🔥 NEW: yt_sub (নতুন ফ্রন্টএন্ডের জন্য)
        targetLink: String,
        quantity: Number,
        planName: String,     // silver/gold (আগের জন্য)
        planId: Number,       // 🔥 NEW: 1, 2, 3 (নতুন ফ্রন্টএন্ডের জন্য)
        durationDays: Number
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);