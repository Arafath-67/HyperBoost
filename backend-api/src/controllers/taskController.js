const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Task = require('../models/Task');
const TaskLog = require('../models/TaskLog');

// 🔥 ১. ডেইলি লিমিট চার্ট (শুধুমাত্র এই কনস্ট্যান্টটি যোগ করেছি)
const PLAN_LIMITS = {
    free: 15,
    silver: 40,
    gold: 70
};

// ২. কাজ ফেচ করা (Hybrid: Official Task + User Campaign)
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId); // ইউজার ডাটা আনলাম লিমিট চেক করার জন্য

        if (!user) return res.status(404).json({ message: "User not found" });

        // ============ 🔥 NEW: ডেইলি লিমিট রিসেট লজিক (শুধু এইটুকুই নতুন) ============
        const today = new Date().setHours(0, 0, 0, 0);
        const lastTaskDate = new Date(user.lastTaskDate || 0).setHours(0, 0, 0, 0);

        if (today > lastTaskDate) {
            user.dailyTaskCount = 0; // নতুন দিন হলে কাউন্টার ০
            user.lastTaskDate = Date.now();
            await user.save();
        }

        // লিমিট চেক
        // (আপনার মডেলে membershipLevel থাকলে সেটাই ব্যবহার করুন, আমি plan দিয়েছি)
        const userPlan = user.membershipLevel || user.plan || 'free'; 
        const dailyLimit = PLAN_LIMITS[userPlan] || 15;

        if (user.dailyTaskCount >= dailyLimit) {
            return res.json({
                success: false,
                limitReached: true,
                message: `Today's limit of ${dailyLimit} tasks reached! Upgrade to VIP.`,
                tasks: { official: [], community: [] }
            });
        }
        // ======================================================================

        // ============ 👇 এখান থেকে নিচ পর্যন্ত সব আপনার অরিজিনাল কোড 👇 ============

        // A. ইউজার আগে যা যা করেছে তার লগ বের করি
        const completedLogs = await TaskLog.find({ user: userId }).select('campaign task');
        
        const completedCampaignIds = completedLogs
            .filter(log => log.campaign)
            .map(log => log.campaign.toString());
            
        const completedTaskIds = completedLogs
            .filter(log => log.task)
            .map(log => log.task.toString());

        // B. অফিসিয়াল সিস্টেম টাস্ক (Admin Tasks) খুঁজি
        const systemTasks = await Task.find({
            isActive: true,
            _id: { $nin: completedTaskIds }
        }).sort('-points');

        // C. কমিউনিটি ক্যাম্পেইন (User Campaigns) খুঁজি
        const userCampaigns = await Campaign.find({
            status: 'active',
            owner: { $ne: userId },
            _id: { $nin: completedCampaignIds },
            completedBy: { $ne: userId }
        }).sort('-priority').limit(20);

        res.status(200).json({
            success: true,
            limitReached: false,
            remainingTasks: dailyLimit - user.dailyTaskCount, // এটা শুধু এক্সট্রা দেখালাম
            tasks: {
                official: systemTasks,
                community: userCampaigns
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

// ৩. কাজ জমা দেওয়া এবং পয়েন্ট যোগ করা
exports.completeTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, type, timeTaken, deviceInfo } = req.body; 

        // ইউজার আনছি লিমিট চেক করার জন্য
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ============ 🔥 NEW: সাবমিট করার আগেও লিমিট চেক (সিকিউরিটি) ============
        const userPlan = user.membershipLevel || user.plan || 'free'; 
        const dailyLimit = PLAN_LIMITS[userPlan] || 15;

        if (user.dailyTaskCount >= dailyLimit) {
            return res.status(403).json({ message: "Daily limit exceeded!" });
        }
        // =====================================================================

        let points = 0;
        let platform = '';
        let actionType = '';
        let logData = {};

        // ============ 👇 আপনার অরিজিনাল লজিক (Official vs Community) 👇 ============
        
        if (type === 'official') {
            const task = await Task.findById(id);
            if (!task || !task.isActive) {
                return res.status(400).json({ message: "Task unavailable" });
            }
            
            const exists = await TaskLog.findOne({ user: userId, task: id });
            if (exists) return res.status(400).json({ message: "Already done!" });

            points = task.points;
            platform = task.platform;
            actionType = task.type; // আপনার মডেলে type ছিল, তাই type রাখলাম
            logData = { task: id };
            
            task.completedCount += 1;
            await task.save();
        } 
        
        else if (type === 'community') {
            const campaign = await Campaign.findById(id);
            if (!campaign || campaign.status !== 'active') {
                return res.status(400).json({ message: "Campaign expired" });
            }

            if (campaign.completedBy.includes(userId)) {
                return res.status(400).json({ message: "Already done!" });
            }

            points = 10; 
            platform = campaign.platform;
            actionType = campaign.actionType;
            logData = { campaign: id };

            campaign.completedCount += 1;
            campaign.completedBy.push(userId);
            
            if (campaign.completedCount >= campaign.targetAmount) {
                campaign.status = 'completed';
            }
            await campaign.save();
        } else {
            return res.status(400).json({ message: "Invalid task type" });
        }

        // ============ COMMON: POINTS & LOGGING ============
        
        user.points += points;
        user.totalEarnedPoints += points;
        
        // 🔥 NEW: কাজ শেষ, তাই কাউন্টার বাড়ালাম
        user.dailyTaskCount += 1;
        user.lastTaskDate = Date.now();
        // ===================================

        await user.save();

        // আপনার অরিজিনাল TaskLog (deviceInfo সহ সব আছে)
        await TaskLog.create({
            user: userId,
            ...logData,
            platform: platform,
            actionType: actionType,
            pointsEarned: points,
            verificationMethod: 'manual',
            timeTaken: timeTaken || 0,
            deviceInfo: deviceInfo || 'Web',
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: `Success! You earned ${points} points.`,
            newBalance: user.points,
            remainingTasks: dailyLimit - user.dailyTaskCount // ফ্রন্টএন্ড আপডেট করার জন্য
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ৪. নতুন অফিসিয়াল টাস্ক তৈরি (আপনার কোড হুবহু রেখেছি)
exports.createTask = async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};