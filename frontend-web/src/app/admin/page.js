'use client';
import { useEffect, useState } from 'react';
import { ShieldAlert, TrendingUp, Users, DollarSign, Activity, Loader2 } from 'lucide-react';
import api from '../../services/api'; 

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingCount: 0,
        approvedCount: 0,
        totalRevenue: 0,
        totalUsers: 0
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            // প্যারালাল রিকোয়েস্ট (দ্রুত লোড হবে)
            const [userRes, statsRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/admin/stats')
            ]);

            if (userRes.data.success) setUser(userRes.data.user);
            
            if (statsRes.data.success) {
                setStats({ 
                    pendingCount: statsRes.data.stats.pendingRequests, 
                    totalRevenue: statsRes.data.stats.totalRevenue,
                    totalUsers: statsRes.data.stats.totalUsers,
                    approvedCount: 0 // ব্যাকএন্ডে এটা যোগ করলে এখানেও পাবেন
                });
            }
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[60vh] text-slate-500"><Loader2 className="animate-spin mr-2"/> Loading Dashboard...</div>;
    }

    return (
        <div className="w-full text-white">
            {/* হেডার */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Overview</h1>
                    <p className="text-slate-400 text-sm">Welcome back, Sir. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-right hidden sm:block px-2">
                        <p className="text-sm font-bold text-white">{user?.username || 'Admin'}</p>
                        <div className="flex items-center justify-end gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-xs text-green-400">System Online</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="font-bold text-lg">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                </div>
            </div>

            {/* স্ট্যাট কার্ডস */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Revenue" 
                    value={`৳ ${stats.totalRevenue.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="text-green-500" 
                    bg="bg-green-500/10" 
                    trend="+12.5%" 
                />
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers.toLocaleString()} 
                    icon={Users} 
                    color="text-blue-500" 
                    bg="bg-blue-500/10" 
                    trend="+5 New" 
                />
                <StatCard 
                    title="Pending Requests" 
                    value={stats.pendingCount} 
                    icon={ShieldAlert} 
                    color="text-yellow-500" 
                    bg="bg-yellow-500/10" 
                    trend={stats.pendingCount > 0 ? "Action Needed" : "All Clear"} 
                />
                <StatCard 
                    title="System Health" 
                    value="98%" 
                    icon={Activity} 
                    color="text-purple-500" 
                    bg="bg-purple-500/10" 
                    trend="Stable" 
                />
            </div>

            {/* চার্ট এরিয়া (যেমন ছিল) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[320px] flex flex-col justify-center items-center text-slate-500">
                <TrendingUp size={48} className="mb-4 opacity-30"/>
                <p className="font-medium">Revenue Analytics Chart</p>
                <p className="text-xs opacity-50 mt-2">Coming in next update</p>
            </div>
        </div>
    );
}

// কার্ড কম্পোনেন্ট
function StatCard({ title, value, icon: Icon, color, bg, trend }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg}`}><Icon size={24} className={color} /></div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border border-slate-700/50 bg-slate-800 ${trend === 'Action Needed' ? 'text-yellow-400' : 'text-emerald-400'}`}>{trend}</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}