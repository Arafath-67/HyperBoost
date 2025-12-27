const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ১. সাধারণ ইউজার প্রোটেকশন
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // ইউজার খোঁজা হচ্ছে
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // 🔥🔥 নতুন কোড: ব্যান চেক (Ban Check) 🔥🔥
            // যদি ইউজার ব্যানড হয়, তবে তাকে 403 এরর দিয়ে বের করে দেওয়া হবে
            if (user.security && user.security.isBanned) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'ACCOUNT_BANNED' // এই স্পেশাল মেসেজটি ফ্রন্টএন্ড ধরবে
                });
            }
            // 🔥🔥 শেষ 🔥🔥

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ২. অ্যাডমিন প্রোটেকশন
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };