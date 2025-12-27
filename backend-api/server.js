require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const startCheatPolice = require('./src/cron/cheatPolice');
const securityPolice = require('./src/middlewares/securityPolice'); // 🔥 নতুন: সিকিউরিটি পুলিশ ইম্পোর্ট

// রাউটস ইম্পোর্ট
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const supportRoutes = require('./src/routes/supportRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

// ডাটাবেস কানেকশন
connectDB();

const app = express();

// 🔥 ১. সঠিক আইপি ট্র্যাকিং
app.set('trust proxy', 1);

// 🔥 ২. জিও-লোকেশন এবং কান্ট্রি ব্লকার পুলিশ (সবার আগে চেক করবে) 🔥
// এটি চেক করবে ইউজার কোন দেশ থেকে এসেছে এবং তাকে ঢুকতে দেওয়া হবে কিনা
app.use(securityPolice);

// 🔥 ৩. সিকিউরিটি মিডলওয়্যার (প্যাকেজ + কাস্টম কোড)

// ক) Helmet: সার্ভারের পরিচয় গোপন করে
app.use(helmet());

// খ) Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json());
// গ) CORS: গেটকিপার
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/api/settings', settingsRoutes);
// ঘ) Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ঙ) Rate Limiter (বট আটকাবে)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 150,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// 🔥 চ) CUSTOM HARDCORE SANITIZER (NoSQL & XSS Protection) 🔥
const cleanData = (data) => {
    if (typeof data === 'string') {
        // ১. NoSQL Injection ($ চিহ্ন সরাও)
        // ২. XSS (< > চিহ্ন সরাও যাতে স্ক্রিপ্ট রান না করে)
        return data.replace(/\$/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    if (data !== null && typeof data === 'object') {
        for (let key in data) {
            data[key] = cleanData(data[key]); // রিকার্সিভলি সব ক্লিন করো
        }
    }
    return data;
};

app.use((req, res, next) => {
    try {
        if (req.body) req.body = cleanData(req.body);
        if (req.query) req.query = cleanData(req.query);
        if (req.params) req.params = cleanData(req.params);
        next();
    } catch (error) {
        console.error("Sanitization Error:", error);
        next(); // এরর হলেও সার্ভার থামবে না
    }
});

// 🔥 ৪. মেইন এপিআই রুটস
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// 🔥 ৫. হেলথ চেক (সাথে দেশ দেখাবে - টেস্টিংয়ের জন্য)
app.get('/', (req, res) => {
    // এখানে আমরা req.clientIp এবং req.country ব্যবহার করতে পারছি কারণ securityPolice এটা সেট করেছে
    res.json({
        project: 'HyperBoost API',
        version: '1.0.0',
        security: 'Geo-Shield & Custom Hardcore 🛡️',
        status: 'All Systems Operational 🚀',
        your_ip: req.clientIp || 'Unknown',
        your_country: req.country || 'Unknown' // আপনি কোন দেশ থেকে আছেন তা দেখাবে
    });
});

// 🔥 ৬. গ্লোবাল এরর হ্যান্ডলার
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

startCheatPolice();

app.listen(PORT, () => {
    console.log(`⚡ HyperBoost Hardcore Server running on port ${PORT}`);
});