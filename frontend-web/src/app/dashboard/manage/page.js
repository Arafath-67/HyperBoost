'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, Facebook, Instagram, Music, Trash2, 
  BarChart2, CheckCircle2, Clock, AlertCircle, Loader2, Zap 
} from 'lucide-react';
import api from '../../../services/api';

export default function ManageAds() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ক্যাম্পেইন লিস্ট লোড করা
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/campaigns/my');
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  // ২. ডিলিট বা স্টপ করার ফাংশন (আপাতত অ্যালার্ট, পরে ব্যাকএন্ডে বসাব)
  const handleDelete = (id) => {
    if(confirm("Are you sure you want to stop this campaign?")) {
        alert("Delete feature coming soon in backend!"); 
        // এখানে পরে api.delete(`/campaigns/${id}`) হবে
    }
  };

  // আইকন সিলেক্টর
  const getIcon = (platform) => {
    switch(platform) {
      case 'youtube': return <Youtube className="text-red-600" />;
      case 'facebook': return <Facebook className="text-blue-600" />;
      case 'instagram': return <Instagram className="text-pink-600" />;
      case 'tiktok': return <Music className="text-black dark:text-white" />;
      default: return <Zap className="text-yellow-500" />;
    }
  };

  if (loading) return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <BarChart2 className="text-indigo-600"/> Manage Campaigns
           </h1>
           <p className="text-slate-500 mt-2">Track the progress of your active promotions.</p>
        </div>
        
        {/* Stats Summary */}
        <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Active</p>
                <p className="text-xl font-bold text-emerald-500">
                    {campaigns.filter(c => c.status === 'active').length}
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-bold text-indigo-500">{campaigns.length}</p>
            </div>
        </div>
      </div>

      {/* --- CAMPAIGN LIST --- */}
      {campaigns.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-slate-400"/>
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Active Campaigns</h3>
            <p className="text-slate-500 mt-2 mb-6">You haven't promoted any channel yet.</p>
            <Link href="/dashboard/promote" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all inline-block">
            Start Promotion
            </Link>
        </div>
      ) : (
        // Grid Layout
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp, index) => {
                // Progress Calculation
                const progress = Math.min((camp.completedCount / camp.targetAmount) * 100, 100);
                
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={camp._id} 
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-800 group"
                    >
                        {/* Top Row: Icon & Status */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-inner">
                                    {getIcon(camp.platform)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white capitalize">
                                        {camp.platform} {camp.actionType}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                                        ID: {camp._id.substring(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1 border ${
                                camp.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                                {camp.status === 'active' ? <Zap size={12}/> : <CheckCircle2 size={12}/>}
                                {camp.status}
                            </span>
                        </div>

                        {/* Middle: Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-indigo-600 font-bold">
                                    {camp.completedCount} / {camp.targetAmount}
                                </span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Bottom: URL & Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <a 
                                href={camp.targetUrl} 
                                target="_blank" 
                                className="text-xs text-indigo-500 font-bold hover:underline truncate max-w-[200px]"
                            >
                                {camp.targetUrl}
                            </a>
                            
                            <button 
                                onClick={() => handleDelete(camp._id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Campaign"
                            >
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      )}
    </div>
  );
}