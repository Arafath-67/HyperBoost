'use client';
import { useState, useEffect } from 'react';
import { Zap, Activity, ShieldCheck, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '../../services/api'; 

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 ডাটাবেস থেকে ইউজার ডাটা আনা
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/auth/me'); 
        if(data.success) {
            setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // লোডিং স্টেট
  if (loading) {
      return (
          <div className="h-[60vh] flex items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
          </div>
      );
  }

  // ✅ ফিক্সড লজিক: ইউজার রোল 'admin' হলে অথবা আপনার ইমেইল হলে বাটন দেখাবে
  // নোট: এখানে আপনার রিয়েল ইমেইলটি বসানো আছে
  const isAdmin = user?.role === 'admin' || user?.email === 'yeasinarafat3257@gmail.com';

  return (
    <div className="space-y-8">
      
      {/* হেডার */}
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
                Welcome back, <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user?.username || 'Commander'}</span>. Systems are operational.
            </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
            <Plus size={18} /> New Campaign
        </button>
      </div>

      {/* 🔥 SECRET ADMIN BUTTON (ফিক্সড) */}
      {isAdmin && (
        <div className="p-4 bg-gradient-to-r from-red-900/20 to-transparent border-l-4 border-red-500 rounded-r-xl flex justify-between items-center animate-pulse">
          <div>
            <h3 className="text-red-500 font-bold flex items-center gap-2">
              <ShieldCheck size={18} /> Admin Access Detected
            </h3>
            <p className="text-gray-400 text-xs">You have super admin privileges.</p>
          </div>
          
          {/* 👇 আমরা আগে পাথ চেঞ্জ করেছিলাম, তাই এখন লিংক হবে /admin */}
          <Link href="/admin">
            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer">
              Go to Admin Panel 🚀
            </button>
          </Link>
        </div>
      )}

      {/* স্ট্যাটস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ব্যালেন্স কার্ড */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group transition-colors">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={100} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Balance</p>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {user?.points || 0} <span className="text-lg text-slate-400 dark:text-slate-500">PTS</span>
                </h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-lg">
                <Activity size={14} /> +0 today
            </div>
        </div>

        {/* ক্যাম্পেইন কার্ড */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 transition-colors">
            <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Campaigns</p>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">0</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Target: 0 Subs / 0 Views</p>
        </div>

        {/* স্ট্যাটাস কার্ড */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 transition-colors">
            <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Status</p>
                <h2 className={`text-3xl font-extrabold mt-2 ${user?.isPremium ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {user?.isPremium ? 'Premium Elite' : 'Basic Member'}
                </h2>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className={`h-full w-[95%] ${user?.isPremium ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {user?.isPremium ? 'All Features Unlocked' : 'Upgrade to Earn Faster'}
            </p>
        </div>
      </div>

      {/* রিসেন্ট অ্যাক্টিভিটি টেবিল */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">View All History →</button>
        </div>
        
        <div className="p-8 text-center text-slate-500">
            <p>No recent tasks found. Start earning points now!</p>
        </div>
      </div>

    </div>
  );
}