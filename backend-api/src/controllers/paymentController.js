const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Campaign = require('../models/Campaign'); // 🔥 এই যে কানেকশন!

// ১. পেমেন্ট রিকোয়েস্ট (User Side)
exports.depositRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            category, paymentMethod, mobileGateway, transactionId, amount, 
            platform, serviceId, targetLink, quantity, planId 
        } = req.body;

        // ডুপ্লিকেট চেক
        if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
            const exists = await Transaction.findOne({ transactionId });
            if(exists) return res.status(400).json({ message: "TrxID already used!" });
        }

        let points = 0;
        let orderDetails = {};
        let finalCategory = category || 'point_pack';

        // A. Point Pack Logic
        if (finalCategory === 'point_pack') {
            points = amount * 10; // Simple logic: 1 TK = 10 Points
        }
        // B. Service Logic
        else if (finalCategory === 'service') {
            if (!targetLink || !quantity) return res.status(400).json({ message: "Missing details" });
            orderDetails = { platform, serviceType: serviceId, targetLink, quantity };
        } 
        // C. Membership Logic
        else if (finalCategory === 'membership') {
            let planName = planId === 2 ? 'silver' : planId === 3 ? 'gold' : 'free';
            orderDetails = { planName, durationDays: 30 };
        }

        const newTrx = await Transaction.create({
            user: userId,
            category: finalCategory,
            paymentMethod: paymentMethod === 'mobile' ? mobileGateway : paymentMethod,
            transactionId: transactionId || `TXN-${Date.now()}`,
            amount,
            pointsAmount: points,
            orderDetails,
            status: 'pending'
        });

        res.status(201).json({ success: true, message: "Request submitted!", orderId: newTrx._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ২. ইউজারের হিস্ট্রি (User Side)
exports.getMyTransactions = async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 ৩. অ্যাডমিন অ্যাপ্রুভাল সিস্টেম (Admin Side - The Magic Happens Here) 🔥
exports.approveTransaction = async (req, res) => {
    try {
        const { transactionId, status } = req.body; // status: 'approved' or 'rejected'
        
        // ট্রানজেকশন খুঁজি
        const trx = await Transaction.findById(transactionId).populate('user');
        if (!trx) return res.status(404).json({ message: "Transaction not found" });
        if (trx.status !== 'pending') return res.status(400).json({ message: "Already processed" });

        // A. যদি রিজেক্ট হয়
        if (status === 'rejected') {
            trx.status = 'rejected';
            await trx.save();
            return res.json({ message: "Transaction Rejected" });
        }

        // B. যদি অ্যাপ্রুভ হয় (Main Logic)
        if (status === 'approved') {
            const user = trx.user;

            // --- CASE 1: POINT PACK ---
            if (trx.category === 'point_pack') {
                user.points += trx.pointsAmount;
                user.totalEarnedPoints += trx.pointsAmount;
                // সাথে টাকাটা ব্যালেন্সেও যোগ করতে পারেন যদি চান
                // user.balance += trx.amount; 
            }

            // --- CASE 2: SERVICE (AUTO CAMPAIGN) ---
            else if (trx.category === 'service') {
                const { platform, serviceType, targetLink, quantity } = trx.orderDetails;
                
                // serviceType (yt_sub) থেকে actionType (subscribe) বের করা
                let actionType = 'view'; // default
                if(serviceType.includes('sub') || serviceType.includes('follow')) actionType = 'subscribe';
                if(serviceType.includes('like')) actionType = 'like';

                // 🔥 অটোমেটিক ক্যাম্পেইন তৈরি!
                await Campaign.create({
                    owner: user._id,
                    platform: platform, // youtube/facebook
                    actionType: actionType, // subscribe/view
                    targetUrl: targetLink,
                    targetAmount: quantity,
                    costPerAction: 0, // পেইড ক্যাম্পেইন, তাই ইউজারের পয়েন্ট কাটবে না
                    isPremiumSlot: true, // টাকা দিয়েছে, তাই এটা প্রিমিয়াম স্লট
                    priority: 20, // ফ্রি ইউজারদের চেয়ে ডাবল প্রায়োরিটি পাবে
                    status: 'active'
                });
            }

            // --- CASE 3: MEMBERSHIP ---
            else if (trx.category === 'membership') {
                const { planName, durationDays } = trx.orderDetails;
                user.isPremium = true;
                user.membershipLevel = planName; // silver/gold
                
                // Expiry Date Set
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + durationDays);
                user.premiumExpiry = expiry;
            }

            // সবশেষে ট্রানজেকশন আপডেট এবং ইউজার সেভ
            trx.status = 'approved';
            await trx.save();
            await user.save();

            return res.json({ success: true, message: `Transaction Approved & ${trx.category} Activated!` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};