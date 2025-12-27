const cron = require('node-cron');
const User = require('../models/User');
const TaskLog = require('../models/TaskLog');

// প্রতিদিন রাত ৩টায় রান হবে (0 3 * * *)
const startCheatPolice = () => {
    cron.schedule('0 3 * * *', async () => {
        console.log('👮‍♂️ Cheat Police Started Scanning...');
        
        // ১. গত ২৪ ঘণ্টায় যারা কাজ করেছে তাদের লিস্ট নাও
        const recentTasks = await TaskLog.find({ 
            createdAt: { $gt: new Date(Date.now() - 24*60*60*1000) },
            status: 'success'
        });

        for (const task of recentTasks) {
            // ২. এখানে আমরা API দিয়ে চেক করব সাবস্ক্রিপশন এখনো আছে কিনা
            // (আপাতত মক লজিক, ভবিষ্যতে রিয়েল ইউটিউব API বসবে)
            const isStillSubscribed = checkRealAPI(task.campaign, task.user); 

            if (!isStillSubscribed) {
                // ৩. ধরা পড়লে শাস্তি!
                const user = await User.findById(task.user);
                
                // ডবল পেনাল্টি
                user.points -= (task.pointsEarned * 2); 
                
                // রিস্ক স্কোর বাড়ানো
                user.security.riskScore += 20; 
                user.security.shadowBanned = user.security.riskScore > 80;

                await user.save();
                console.log(`🚫 Cheater Caught: ${user.username}. Points Deducted.`);
            }
        }
        console.log('👮‍♂️ Scan Completed.');
    });
};

// ডামি ফাংশন (ভবিষ্যতে রিয়েল হবে)
const checkRealAPI = (campaignId, userId) => {
    // এখানে ইউটিউব API কল হবে
    return true; // আপাতত সবাই ভালো
};

module.exports = startCheatPolice;