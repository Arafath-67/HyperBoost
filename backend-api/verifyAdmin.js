const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Database Connected...');

        // অ্যাডমিনকে খুঁজে বের করা
        const admin = await User.findOne({ email: 'yeasinarafat3257@gmail.com' });

        if (!admin) {
            console.log('❌ Admin not found! Please run createAdmin.js first.');
        } else {
            // ভেরিফাই করে দেওয়া
            admin.isVerified = true; 
            await admin.save();
            console.log('✅ Admin Verified Successfully! Login Now.');
        }
        process.exit();

    } catch (error) {
        console.log('❌ Error:', error.message);
        process.exit(1);
    }
};

verifyAdmin();