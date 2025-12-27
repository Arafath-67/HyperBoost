'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Youtube, Facebook, Instagram, Music, ShieldAlert, Scale, Eye, Hand, 
    Zap, TrendingUp, Info, ShieldCheck, ArrowUpRight, Loader2, CheckCircle, 
    ExternalLink, Play, DollarSign, Layers, Activity, HelpCircle, ChevronDown, AlertTriangle 
} from 'lucide-react';

// 🔥 পাথ ঠিক আছে (৩ ধাপ পেছনে)
import api from '../../../services/api'; 
import useSettings from '../../../hooks/useSettings'; 

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function EarnPoints() {
  // 🔥 Warning Modal (Default: TRUE)
  const [showWarning, setShowWarning] = useState(true); 
  
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({ official: [], community: [] });
  
  // 🔥 Real-time Stats State
  const [userStats, setUserStats] = useState({ 
      totalEarned: 0, 
      currentBalance: 0,
      activeTasks: 0 
  });

  // Interaction States
  const [processingId, setProcessingId] = useState(null); 
  const [canClaim, setCanClaim] = useState(false); 
  const [countdown, setCountdown] = useState(10);
  const [openFaq, setOpenFaq] = useState(null); 

  // 1. Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        
        // A. Tasks Fetch
        const tasksRes = await api.get('/tasks/list');
        let official = [];
        let community = [];
        
        if(tasksRes.data.success) {
            official = tasksRes.data.tasks.official || [];
            community = tasksRes.data.tasks.community || [];
            setTasks({ official, community });
        }

        // B. User Stats Fetch (Profile API)
        const userRes = await api.get('/auth/me'); 
        if(userRes.data.success) {
            setUserStats({
                totalEarned: userRes.data.user.totalEarnedPoints || 0,
                currentBalance: userRes.data.user.points || 0,
                activeTasks: official.length + community.length
            });
        }
    } catch (error) {
        console.error("Failed to fetch data", error);
    } finally {
        setLoading(false);
    }
  };

  // 2. Start Task Logic
  const handleStartTask = (task, type) => {
    setProcessingId(task._id);
    setCanClaim(false);
    setCountdown(10);

    const url = type === 'official' ? task.url : task.targetUrl;
    window.open(url, '_blank');

    const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                setCanClaim(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };

  // 3. Claim Reward Logic
  const handleClaimReward = async (taskId, type) => {
    try {
        const { data } = await api.post('/tasks/complete', {
            id: taskId,
            type: type, 
            timeTaken: 15,
            deviceInfo: navigator.userAgent
        });

        if (data.success) {
            alert(`🎉 Points Added! New Balance: ${data.newPoints || 'Updated'}`);
            
            // Remove from list
            if(type === 'official') {
                setTasks(prev => ({ ...prev, official: prev.official.filter(t => t._id !== taskId) }));
            } else {
                setTasks(prev => ({ ...prev, community: prev.community.filter(t => t._id !== taskId) }));
            }

            // Update Stats
            setUserStats(prev => ({
                ...prev,
                totalEarned: prev.totalEarned + (data.pointsEarned || 10),
                currentBalance: data.newPoints || prev.currentBalance + 10,
                activeTasks: prev.activeTasks - 1
            }));

            setProcessingId(null);
        }
    } catch (error) {
        alert(error.response?.data?.message || "Verification Failed");
        setProcessingId(null);
    }
  };

  const platforms = [
    { 
      id: 'youtube', name: 'YouTube', action: 'Subscribe & View', tasks: 'High Payout', 
      icon: Youtube, color: 'text-red-600', bg: 'bg-red-600',
      glassBg: 'hover:bg-red-50/50 dark:hover:bg-red-900/10', borderColor: 'hover:border-red-500', glow: 'shadow-red-500/20', 
      link: '/dashboard/earn/youtube', desc: 'Watch videos & Subscribe channels.'
    },
    { 
      id: 'facebook', name: 'Facebook', action: 'Follow & Like', tasks: 'Easy', 
      icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600',
      glassBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10', borderColor: 'hover:border-blue-500', glow: 'shadow-blue-500/20', 
      link: '/dashboard/earn/facebook', desc: 'Follow pages & React to posts.'
    },
    { 
      id: 'instagram', name: 'Instagram', action: 'Follow & Heart', tasks: 'Popular', 
      icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-600',
      glassBg: 'hover:bg-pink-50/50 dark:hover:bg-pink-900/10', borderColor: 'hover:border-pink-500', glow: 'shadow-pink-500/20', 
      link: '/dashboard/earn/instagram', desc: 'Follow profiles & Like photos.'
    },
    { 
      id: 'tiktok', name: 'TikTok', action: 'Follow & Like', tasks: 'Trending', 
      icon: Music, color: 'text-slate-900 dark:text-white', bg: 'bg-black',
      glassBg: 'hover:bg-slate-100/50 dark:hover:bg-slate-800/30', borderColor: 'hover:border-slate-500', glow: 'shadow-slate-500/20', 
      link: '/dashboard/earn/tiktok', desc: 'Watch clips & Follow creators.'
    }
  ];

  const faqs = [
      { q: "Can I use multiple accounts?", a: "No. Multiple accounts will lead to a permanent ban." },
      { q: "When do I get points?", a: "Points are added immediately after verification." },
      { q: "What happens if I unsubscribe?", a: "You will lose points and may get a negative trust score." }
  ];

  return (
    <div className="relative min-h-screen pb-20">
      
      {/* =======================================
          🚨 1. WARNING MODAL (The Gatekeeper)
         ======================================= */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0F1117] rounded-3xl shadow-2xl overflow-hidden border border-red-200 dark:border-red-900/50"
            >
               <div className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-transparent p-8 border-b border-red-100 dark:border-red-900/30 flex items-center gap-4">
                  <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full animate-pulse shadow-inner">
                      <ShieldAlert className="text-red-600 dark:text-red-500" size={40} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">Security Protocol Check</h3>
                      <p className="text-red-600/70 dark:text-red-400/70">Read carefully before proceeding.</p>
                  </div>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3 mb-3 text-slate-900 dark:text-white font-bold">
                              <Scale className="text-indigo-500" size={24} /> The Law of Exchange
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              This is a community. If you fake your tasks, other users will fake theirs on you.
                          </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3 mb-3 text-slate-900 dark:text-white font-bold">
                              <Eye className="text-indigo-500" size={24} /> Everything is Recorded
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              Scam attempts lead to a <span className="font-bold text-red-500">Permanent Device Ban</span>.
                          </p>
                      </div>
                  </div>
                  <button onClick={() => setShowWarning(false)} className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-red-500/20">
                      <Hand size={20} /> I Promise to be Honest & Fair
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        initial="hidden" animate="visible" variants={containerVariants}
        className={`space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-500 ${showWarning ? 'blur-md pointer-events-none opacity-50 h-screen overflow-hidden' : 'blur-0 opacity-100'}`}
      >
        
        {/* 2. HEADER & REAL-TIME STATS */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Earn Points</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg max-w-xl">Complete tasks to grow your channel.</p>
            </motion.div>
            
            {/* 🔥 Real Data Display */}
            <motion.div variants={itemVariants} className="flex gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 w-40">
                    <p className="text-xs text-slate-500 uppercase font-bold">Lifetime Earned</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <DollarSign size={18}/> {loading ? '...' : userStats.totalEarned}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 w-40">
                    <p className="text-xs text-slate-500 uppercase font-bold">Active Tasks</p>
                    <p className="text-2xl font-bold text-indigo-600 flex items-center gap-1">
                        <Layers size={18}/> {loading ? '...' : userStats.activeTasks}
                    </p>
                </div>
            </motion.div>
        </div>

        {/* 3. PRO TIPS GRID */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-3 text-indigo-700 dark:text-indigo-400 font-bold text-lg"><Zap size={20} /> Speed Tip</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Want to earn faster? Use the "Auto-Play" feature (Premium) to earn points while you sleep.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-3 text-emerald-700 dark:text-emerald-400 font-bold text-lg"><TrendingUp size={20} /> Higher Rewards</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">YouTube subscriptions pay 2x more points than regular likes. Prioritize them for max profit.</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-900 p-6 rounded-3xl border border-orange-100 dark:border-orange-500/20 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-3 text-orange-700 dark:text-orange-400 font-bold text-lg"><Info size={20} /> Daily Bonus</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Complete 50 tasks today to unlock a +500 Point Bonus instantly.</p>
            </div>
        </motion.div>

        {/* 4. PLATFORM SELECTOR */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Select Platform</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((p) => (
                  <Link key={p.id} href={p.link} className="block h-full">
                      <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }} className={`h-[280px] group relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm p-8 flex flex-col justify-between transition-all duration-300 ${p.borderColor} hover:shadow-2xl ${p.glow} ${p.glassBg}`}>
                          <div className="absolute -right-10 -bottom-10 opacity-5 dark:opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 ease-out"><p.icon size={200} className={p.color} /></div>
                          <div className="relative z-10">
                              <div className="flex justify-between items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/10 backdrop-blur-md shadow-sm border border-slate-100 dark:border-white/5`}><p.icon className={p.color} size={28} /></div>
                                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-900 dark:group-hover:bg-white dark:group-hover:text-black transition-all"><ArrowUpRight size={18} /></div>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-6">{p.name}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{p.desc}</p>
                          </div>
                          <div className="relative z-10 mt-6">
                             <div className="flex items-center gap-2 mb-3">
                                 <span className="relative flex h-2 w-2"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${p.bg}`}></span><span className={`relative inline-flex rounded-full h-2 w-2 ${p.bg}`}></span></span>
                                 <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">{p.tasks}</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className={`h-full w-[70%] rounded-full ${p.bg}`}></div></div>
                          </div>
                      </motion.div>
                  </Link>
              ))}
          </div>
        </motion.div>

        {/* 5. FEATURED TASKS (REAL API DATA) */}
        <motion.div variants={itemVariants} className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               Featured Tasks {loading && <Loader2 className="animate-spin text-indigo-600" size={20} />}
            </h2>

            <div className="space-y-4">
                {/* Official Tasks Loop */}
                {tasks.official.map((task) => (
                    <div key={task._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-indigo-500 transition-colors">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center"><ShieldCheck size={28} /></div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{task.title || 'Official Task'}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-xs font-bold uppercase">Official</span>
                                    <span>• {task.platform}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right"><p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">+{task.points}</p><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Points</p></div>
                            {processingId === task._id ? (
                                <button onClick={() => canClaim && handleClaimReward(task._id, 'official')} disabled={!canClaim} className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 transition-all min-w-[180px] justify-center shadow-lg ${canClaim ? 'bg-green-600 hover:bg-green-700 animate-bounce' : 'bg-slate-400 cursor-not-allowed'}`}>
                                    {canClaim ? <><CheckCircle size={20}/> Claim</> : <><Loader2 className="animate-spin" size={20}/> {countdown}s</>}
                                </button>
                            ) : (
                                <button onClick={() => handleStartTask(task, 'official')} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/10"><Play size={20} fill="currentColor" /> Start Task</button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Community Tasks Loop */}
                {tasks.community.map((task) => (
                    <div key={task._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-emerald-500 transition-colors">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center"><ExternalLink size={28} /></div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg capitalize">{task.platform} {task.actionType}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase">Community</span>
                                    <span>• Priority: {task.priority > 1 ? 'High' : 'Normal'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right"><p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">+10</p><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Points</p></div>
                            {processingId === task._id ? (
                                <button onClick={() => canClaim && handleClaimReward(task._id, 'community')} disabled={!canClaim} className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 transition-all min-w-[180px] justify-center shadow-lg ${canClaim ? 'bg-green-600 hover:bg-green-700 animate-bounce' : 'bg-slate-400 cursor-not-allowed'}`}>
                                    {canClaim ? <><CheckCircle size={20}/> Claim</> : <><Loader2 className="animate-spin" size={20}/> {countdown}s</>}
                                </button>
                            ) : (
                                <button onClick={() => handleStartTask(task, 'community')} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-lg"><Play size={20} fill="currentColor" /> Start</button>
                            )}
                        </div>
                    </div>
                ))}

                {!loading && tasks.official.length === 0 && tasks.community.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <p className="text-slate-400 text-lg">No tasks available at the moment.</p>
                    </div>
                )}
            </div>
        </motion.div>

        {/* 6. FAQ SECTION */}
        <motion.div variants={itemVariants} className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle size={24} className="text-indigo-500"/> Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                        <div className="flex justify-between items-center"><h4 className="font-bold text-slate-800 dark:text-slate-200">{item.q}</h4><ChevronDown size={18} className={`transition-transform text-slate-400 ${openFaq === idx ? 'rotate-180' : ''}`}/></div>
                        {openFaq === idx && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 text-sm text-slate-500 leading-relaxed">{item.a}</motion.p>}
                    </div>
                ))}
            </div>
        </motion.div>

        {/* 7. FOOTER POLICY */}
        <motion.div variants={itemVariants} className="bg-slate-900 dark:bg-black border border-slate-800 dark:border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-2xl">
            <div className="p-4 bg-slate-800 rounded-full text-indigo-400 shadow-inner"><ShieldCheck size={40} /></div>
            <div>
                <h4 className="text-xl font-bold text-white mb-2">Fair Loop Policy Guarantee</h4>
                <p className="text-slate-400 max-w-2xl leading-relaxed">We use a <span className="text-white font-bold">1:1 Interaction Ratio</span>. This means for every valid follow you give, you are guaranteed to receive one back. Our AI monitors this balance 24/7.</p>
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
}