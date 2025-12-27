const Campaign = require('../models/Campaign');
const User = require('../models/User');

// ১. নতুন ক্যাম্পেইন তৈরি করা (Create)
exports.createCampaign = async (req, res) => {
    try {
        const { platform, actionType, targetUrl, targetAmount } = req.body;
        const userId = req.user.id;

        // A. খরচ হিসাব করা (Cost Calculation)
        // ১টা সাবস্ক্রাইব = ১০ পয়েন্ট (ফিক্সড রেট)
        const costPerAction = 10;
        const totalCost = targetAmount * costPerAction;

        // B. ইউজারের ব্যালেন্স চেক করা
        const user = await User.findById(userId);

        if (user.points < totalCost) {
            return res.status(400).json({ message: `Not enough points! You need ${totalCost} points.` });
        }

        // C. পয়েন্ট কেটে নেওয়া (Deduct Points)
        user.points -= totalCost;
        await user.save();

        // D. ক্যাম্পেইন তৈরি করা
        // ইউজার প্রিমিয়াম হলে, ক্যাম্পেইনও প্রিমিয়াম হবে (1+1 Loop এ ঢুকবে)
        const newCampaign = await Campaign.create({
            owner: userId,
            platform,
            actionType, // 'subscribe' or 'view'
            targetUrl,
            targetAmount,
            costPerAction,
            isPremiumSlot: user.isPremium, // ইউজারের স্ট্যাটাস অনুযায়ী সেট হবে
            priority: user.isPremium ? 10 : 1 // প্রিমিয়াম হলে প্রায়োরিটি ১০, নাহলে ১
        });

        res.status(201).json({
            success: true,
            message: 'Campaign created successfully!',
            campaign: newCampaign,
            remainingPoints: user.points
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ২. নিজের ক্যাম্পেইন দেখা (My Campaigns)
exports.getMyCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ owner: req.user.id })
                                        .sort({ createdAt: -1 }); // লেটেস্ট আগে দেখাবে
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};