const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
    settingId: { type: String, default: 'global_config', unique: true },
    bannedCountries: {
        type: [String],
        default: [] // যেমন: ['IN', 'PK']
    },
    isMaintenanceMode: { type: Boolean, default: false },
    vpnDetectionLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);