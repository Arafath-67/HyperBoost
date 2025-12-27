const PlatformSettings = require('../models/PlatformSettings');

// ১. সেটিংস দেখা (Get Settings)
// যদি প্রথমবার হয় এবং ডাটাবেসে কিছু না থাকে, তাহলে ডিফল্ট সেটিংস তৈরি করে দেবে
exports.getSettings = async (req, res) => {
    try {
        let settings = await PlatformSettings.findOne();
        
        if (!settings) {
            settings = await PlatformSettings.create({});
        }

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error('Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ২. সেটিংস আপডেট করা (Update Settings)
// ফ্রন্টএন্ড থেকে যে ডাটা আসবে, সেটাই সেভ হবে
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body; // ফ্রন্টএন্ড থেকে পুরো অবজেক্ট আসবে

        // আমরা findOneAndUpdate ব্যবহার করব যাতে আগের ডাটা মুছে না যায়
        const settings = await PlatformSettings.findOneAndUpdate(
            {}, 
            { $set: updates }, 
            { new: true, upsert: true } // upsert: true মানে না থাকলে বানিয়ে নেবে
        );

        res.status(200).json({ 
            success: true, 
            message: 'Settings updated successfully!', 
            data: settings 
        });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
};