'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, Facebook, Instagram, Music, Link as LinkIcon, 
  DollarSign, AlertCircle, Rocket, Loader2, Zap, CheckCircle2 
} from 'lucide-react';
import api from '../../../services/api';

// অ্যানিমেশন ভেরিয়েন্ট
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Promote() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // ফর্ম স্টেট
  const [platform, setPlatform] = useState('youtube');
  const [actionType, setActionType] = useState('subscribe');
  const [targetUrl, setTargetUrl] = useState('');
  const [quantity, setQuantity] = useState(10);
  
  const COST_PER_ACTION = 10; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) setUser(data.user);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const totalCost = quantity * COST_PER_ACTION;
  const canAfford = user ? user.points >= totalCost : false;

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!canAfford) return;
    if (!targetUrl) return alert("Please enter a valid URL");

    setSubmitting(true);
    try {
      const { data } = await api.post('/campaigns/create', {
        platform, actionType, targetUrl, targetAmount: quantity
      });
      if (data.success) {
        alert("🎉 Campaign Launched Successfully!");
        setUser(prev => ({ ...prev, points: data.remainingPoints }));
        setTargetUrl('');
        setQuantity(10);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', shadow: 'shadow-red-500/20', border: 'peer-checked:border-red-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', shadow: 'shadow-blue-500/20', border: 'peer-checked:border-blue-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'text-pink-500', shadow: 'shadow-pink-500/20', border: 'peer-checked:border-pink-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-fuchsia-500', shadow: 'shadow-fuchsia-500/20', border: 'peer-checked:border-fuchsia-500' }
  ];

  if (loading) return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="max-w-6xl mx-auto pb-20"
    >
      
      {/* Header with Gradient Text */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Boost Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Influence</span> 🚀
        </h1>
        <p className="text-slate-500 text-lg">Create a campaign instantly and get real engagement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDE: CONFIGURATION (8 Columns) --- */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Platform Selector Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span> Select Platform
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {platforms.map((p) => (
                        <div key={p.id} className="relative group cursor-pointer">
                            <input 
                                type="radio" 
                                name="platform" 
                                id={p.id} 
                                className="peer hidden" 
                                checked={platform === p.id}
                                onChange={() => setPlatform(p.id)}
                            />
                            <label 
                                htmlFor={p.id}
                                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:scale-105 ${p.border} peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:shadow-2xl ${p.shadow}`}
                            >
                                <p.icon size={32} className={`${p.color} mb-3 filter drop-shadow-lg`} />
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{p.name}</span>
                                
                                {/* Checkmark Animation */}
                                {platform === p.id && (
                                    <motion.div 
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute top-3 right-3 text-emerald-500"
                                    >
                                        <CheckCircle2 size={18} fill="currentColor" className="text-white"/>
                                    </motion.div>
                                )}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Target & Quantity Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span> Campaign Details
                </h3>

                <div className="space-y-6">
                    {/* Action Type */}
                    <div className="grid grid-cols-2 gap-4">
                        {['subscribe', 'like', 'view', 'comment'].map((action) => (
                            <button
                                key={action}
                                onClick={() => setActionType(action)}
                                className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all ${
                                    actionType === action 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* URL Input with Focus Animation */}
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl flex items-center px-4 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-colors">
                            <LinkIcon className="text-slate-400 mr-3" size={20}/>
                            <input 
                                type="url" 
                                placeholder={`Paste your ${platform} link here...`}
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                className="w-full py-4 bg-transparent outline-none font-medium text-slate-700 dark:text-white placeholder-slate-400"
                            />
                        </div>
                    </div>

                    {/* Fancy Slider */}
                    <div className="pt-4">
                        <div className="flex justify-between items-end mb-4">
                            <label className="font-bold text-slate-600 dark:text-slate-400">Target Quantity</label>
                            <div className="text-right">
                                <span className="text-3xl font-extrabold text-indigo-600">{quantity}</span>
                                <span className="text-sm font-bold text-slate-400 ml-1 uppercase">{actionType}s</span>
                            </div>
                        </div>
                        
                        <input 
                            type="range" 
                            min="10" max="1000" step="10" 
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                        />
                        <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                            <span>10</span>
                            <span>500</span>
                            <span>1000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDE: SUMMARY (4 Columns) --- */}
        <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
                
                {/* 3. Live Preview Card (Glass Effect) */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Your Balance</p>
                                <h2 className="text-4xl font-extrabold flex items-center gap-1">
                                    <Zap size={28} className="text-yellow-300 fill-yellow-300"/> {user?.points}
                                </h2>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="text-white"/>
                            </div>
                        </div>

                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/10">
                            <div className="flex justify-between text-indigo-100 text-sm">
                                <span>Total Cost</span>
                                <span className="font-bold text-white">{totalCost} Pts</span>
                            </div>
                            <div className="flex justify-between text-indigo-100 text-sm">
                                <span>Remaining</span>
                                <span className={`font-bold ${user?.points >= totalCost ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {user?.points - totalCost} Pts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Checkout Action */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Summary</h3>
                    
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={18} className="text-emerald-500"/>
                            <span className="flex-1">Platform</span>
                            <span className="font-bold text-slate-900 dark:text-white capitalize">{platform}</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={18} className="text-emerald-500"/>
                            <span className="flex-1">Action</span>
                            <span className="font-bold text-slate-900 dark:text-white capitalize">{actionType}</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={18} className="text-emerald-500"/>
                            <span className="flex-1">Est. Delivery</span>
                            <span className="font-bold text-slate-900 dark:text-white">~2 Hours</span>
                        </li>
                    </ul>

                    {!canAfford && (
                        <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl mb-4 border border-red-100 animate-pulse">
                            <AlertCircle size={18}/> Low Balance! Earn more points.
                        </div>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateCampaign}
                        disabled={!canAfford || submitting || !targetUrl}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${
                            canAfford 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-2xl' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {submitting ? <Loader2 className="animate-spin"/> : <Rocket size={22}/>}
                        {submitting ? 'Launching...' : 'Launch Campaign'}
                    </motion.button>
                </div>

            </div>
        </div>

      </div>
    </motion.div>
  );
}