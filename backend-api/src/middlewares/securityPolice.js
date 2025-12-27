const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const GlobalSettings = require('../models/GlobalSettings');

const securityPolice = async (req, res, next) => {
    try {
        // ১. আইপি বের করা
        const clientIp = requestIp.getClientIp(req); 
        req.clientIp = clientIp;

        // ২. দেশ বের করা
        const geo = geoip.lookup(clientIp);
        const country = geo ? geo.country : 'Unknown'; 
        req.country = country; 

        // ৩. ডাটাবেস চেক করা
        let settings = await GlobalSettings.findOne({ settingId: 'global_config' });
        if (!settings) {
            settings = await GlobalSettings.create({ settingId: 'global_config' });
        }

        // ৪. মেইনটেনেন্স মোড
        if (settings.isMaintenanceMode && !req.path.includes('/admin')) {
            return res.status(503).json({ message: 'System under maintenance.' });
        }

        // ৫. কান্ট্রি ব্যান চেক 🚫
        if (settings.bannedCountries.includes(country)) {
            console.log(`🚫 Banned Access: ${country} IP: ${clientIp}`);
            return res.status(403).json({ 
                success: false, 
                message: 'Access Denied from your region.' 
            });
        }

        next();
    } catch (error) {
        console.error('Security Police Error:', error);
        next();
    }
};

module.exports = securityPolice;