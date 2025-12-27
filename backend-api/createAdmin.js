const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Database Connected...');

        // আগের অ্যাকাউন্ট চেক করা
        const exist = await User.findOne({ email: 'yeasinarafat3257@gmail.com' });
        if(exist) {
            console.log('⚠️ Admin already exists! Deleting old one to refresh role...');
            await User.findOneAndDelete({ email: 'yeasinarafat3257@gmail.com' });
            console.log('🗑️ Old account deleted.');
        }

        const salt = await bcrypt.genSalt(10);
        // পাসওয়ার্ড এখানে 123456 সেট করা আছে, চাইলে বদলাতে পারেন
        const hashedPassword = await bcrypt.hash('123456', salt);

        // নতুন অ্যাডমিন তৈরি
        await User.create({
            username: 'SuperAdmin Yeasin',
            email: 'yeasinarafat3257@gmail.com',
            password: hashedPassword,
            role: 'admin', // 🔥 এই রোলটাই মূল চাবি
            points: 100000,
            isPremium: true,
            isVerified: true // সরাসরি ভেরিফাইড
        });

        console.log('🎉 Super Admin Created Successfully!');
        console.log('📧 Login: yeasinarafat3257@gmail.com');
        console.log('🔑 Pass: 123456');
        process.exit();

    } catch (error) {
        console.log('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();