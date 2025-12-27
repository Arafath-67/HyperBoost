const User = require('../models/User');
const Transaction = require('../models/Transaction'); // 🔥 ড্যাশবোর্ডের জন্য এটা লাগবে

// ১. ড্যাশবোর্ড ওভারভিউ স্ট্যাটস (🔥 নতুন যোগ করা হলো)
const getDashboardStats = async (req, res) => {
    try {
        // ক. টোটাল ইউজার কাউন্ট
        const totalUsers = await User.countDocuments();

        // খ. পেন্ডিং রিকোয়েস্ট (Transaction এর স্ট্যাটাস চেক করে)
        const pendingRequests = await Transaction.countDocuments({ status: 'pending' });
        
        // গ. টোটাল রেভিনিউ (শুধু Approved ট্রানজেকশনগুলোর যোগফল)
        const revenueStats = await Transaction.aggregate([
            { $match: { status: 'approved' } }, 
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalAmount : 0;

        // ঘ. সিস্টেম হেলথ (স্ট্যাটিক ভ্যালু)
        const systemHealth = 98; 

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalRevenue,
                pendingRequests,
                systemHealth
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};

// ২. সব ইউজার আনার লজিক (আপনার আগের কোড)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            count: users.length, 
            users: users 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ৩. ইউজার ব্যান/আনব্যান করার লজিক (আপনার আগের কোড)
const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (user) {
            if (!user.security) {
                user.security = {};
            }

            user.security.isBanned = !user.security.isBanned;
            
            user.markModified('security'); 
            
            await user.save();

            res.json({ 
                success: true, 
                message: `User ${user.security.isBanned ? 'BANNED 🔴' : 'UNBANNED 🟢'} successfully` 
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🔥 ৩টা ফাংশনই এক্সপোর্ট করা হলো
module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    toggleBanUser 
};