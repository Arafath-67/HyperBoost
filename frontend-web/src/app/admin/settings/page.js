'use client';
import { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle, Smartphone, DollarSign, Server } from 'lucide-react'; // আইকন (যদি ইন্সটল না থাকে, বাদ দিতে পারেন)

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('platforms'); // platforms, payments, system
    const [settings, setSettings] = useState(null);

    // ১. সেটিংস লোড করা
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // আপনার ব্যাকএন্ড পোর্ট যদি 5000 হয়
                const res = await fetch('http://localhost:5000/api/settings'); 
                const data = await res.json();
                if (data.success) {
                    setSettings(data.data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // ২. সেটিংস আপডেট করা
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            if (data.success) {
                alert('✅ Settings Saved Successfully!');
            }
        } catch (error) {
            alert('❌ Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    // টগল হ্যান্ডলার (খুবই স্মার্ট ফাংশন)
    const togglePlatform = (platform) => {
        setSettings(prev => ({
            ...prev,
            platforms: {
                ...prev.platforms,
                [platform]: {
                    ...prev.platforms[platform],
                    isEnabled: !prev.platforms[platform].isEnabled
                }
            }
        }));
    };

    const toggleService = (platform, service) => {
        setSettings(prev => ({
            ...prev,
            platforms: {
                ...prev.platforms,
                [platform]: {
                    ...prev.platforms[platform],
                    services: {
                        ...prev.platforms[platform].services,
                        [service]: !prev.platforms[platform].services[service]
                    }
                }
            }
        }));
    };

    if (loading) return <div className="p-10 text-white">Loading Control Panel...</div>;

    return (
        <div className="p-6 bg-[#0f0f13] min-h-screen text-slate-200">
            {/* হেডার */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">⚙️ Master Control</h1>
                    <p className="text-slate-400">Manage your entire platform from one place</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    {saving ? 'Saving...' : <><Save size={20}/> Save Changes</>}
                </button>
            </div>

            {/* ট্যাব মেনু */}
            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1">
                {['platforms', 'payments', 'system'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize font-semibold transition-all ${
                            activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ১. PLATFORMS TAB */}
            {activeTab === 'platforms' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(settings.platforms).map((key) => {
                        const platform = settings.platforms[key];
                        return (
                            <div key={key} className={`p-5 rounded-2xl border ${platform.isEnabled ? 'border-slate-700 bg-[#15151a]' : 'border-red-900/30 bg-red-900/10'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold capitalize flex items-center gap-2">
                                        {key} {platform.isEnabled ? <CheckCircle size={16} className="text-green-500"/> : <AlertTriangle size={16} className="text-red-500"/>}
                                    </h3>
                                    {/* মাস্টার সুইচ */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={platform.isEnabled} 
                                            onChange={() => togglePlatform(key)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                {/* সাব-সার্ভিসেস */}
                                <div className={`space-y-3 ${!platform.isEnabled && 'opacity-50 pointer-events-none'}`}>
                                    {Object.keys(platform.services).map(service => (
                                        <div key={service} className="flex justify-between items-center bg-[#0f0f13] p-3 rounded-lg">
                                            <span className="capitalize text-sm text-slate-300">{service}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={platform.services[service]} 
                                                    onChange={() => toggleService(key, service)}
                                                    className="sr-only peer" 
                                                />
                                                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ২. PAYMENTS TAB */}
            {activeTab === 'payments' && (
                <div className="bg-[#15151a] p-6 rounded-2xl border border-slate-700 max-w-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <DollarSign className="text-yellow-400"/> Payment Settings
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">bKash Number (Personal)</label>
                            <input 
                                type="text" 
                                value={settings.transactions.bkashNumber}
                                onChange={(e) => setSettings({...settings, transactions: {...settings.transactions, bkashNumber: e.target.value}})}
                                className="w-full bg-[#0f0f13] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Nagad Number (Personal)</label>
                            <input 
                                type="text" 
                                value={settings.transactions.nagadNumber}
                                onChange={(e) => setSettings({...settings, transactions: {...settings.transactions, nagadNumber: e.target.value}})}
                                className="w-full bg-[#0f0f13] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Exchange Rate (Points per 1 Taka)</label>
                            <input 
                                type="number" 
                                value={settings.transactions.exchangeRate}
                                onChange={(e) => setSettings({...settings, transactions: {...settings.transactions, exchangeRate: Number(e.target.value)}})}
                                className="w-full bg-[#0f0f13] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex justify-between items-center p-4 bg-yellow-900/10 border border-yellow-900/30 rounded-lg">
                            <span className="text-yellow-200">Allow User Deposits?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings.transactions.allowDeposits}
                                    onChange={(e) => setSettings({...settings, transactions: {...settings.transactions, allowDeposits: e.target.checked}})}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-yellow-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* ৩. SYSTEM TAB */}
            {activeTab === 'system' && (
                <div className="space-y-6 max-w-2xl">
                    <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Server className="text-red-500" size={24}/>
                            <h3 className="text-xl font-bold text-red-200">Maintenance Mode</h3>
                        </div>
                        <p className="text-slate-400 mb-4 text-sm">
                            Turning this ON will block all users from accessing the site. Only admins can login.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-white">System Status:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings.system.maintenanceMode}
                                    onChange={(e) => setSettings({...settings, system: {...settings.system, maintenanceMode: e.target.checked}})}
                                    className="sr-only peer" 
                                />
                                <div className="w-14 h-7 bg-green-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
                            </label>
                            <span className={`text-sm font-bold ${settings.system.maintenanceMode ? 'text-red-500' : 'text-green-500'}`}>
                                {settings.system.maintenanceMode ? '🔴 MAINTENANCE ON' : '🟢 LIVE'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#15151a] border border-slate-700 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4">Registration Control</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Allow new users to register?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings.system.allowRegistration}
                                    onChange={(e) => setSettings({...settings, system: {...settings.system, allowRegistration: e.target.checked}})}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}