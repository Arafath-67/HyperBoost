'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Facebook, ThumbsUp, CheckCircle, Lock, Eye, Clock, Loader2, Ban, 
    Tv, ExternalLink, Zap, AlertTriangle, Play, ShieldCheck, 
    Info, TrendingUp, DollarSign 
} from 'lucide-react';
import api from '../../../../services/api'; 
import useSettings from '../../../../hooks/useSettings'; 

const TARGET_PLATFORM = 'facebook'; 
const AD_DURATION = 15; 

// Animation Variants for smooth entrance
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function FacebookTaskPage() {
  const { settings, loading: configLoading } = useSettings();
  const [loading, setLoading] = useState(true);

  // --- Task Data States ---
  const [taskOne, setTaskOne] = useState(null); // The Main Unlocked Task
  const [taskTwo, setTaskTwo] = useState(null); // The Locked Task (only if premium exists)
  const [viewTasks, setViewTasks] = useState([]); // Video Tasks

  // --- Interaction States ---
  const [firstTaskDone, setFirstTaskDone] = useState(false); 
  const [isVerifying, setIsVerifying] = useState(false); 
  const [taskTimer, setTaskTimer] = useState(0); 
  const [processingId, setProcessingId] = useState(null);

  // --- Ad System States ---
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const pendingTaskRef = useRef(null); 

  useEffect(() => { 
      fetchPlatformTasks(); 
  }, []);

  // 🔥 1. SMART DATA FETCHING
  const fetchPlatformTasks = async () => {
    try {
        const { data } = await api.get('/tasks/list');
        if(data.success) {
            // Filter tasks specifically for Facebook
            const official = data.tasks.official.find(t => t.platform === TARGET_PLATFORM && t.type === 'follow');
            const community = data.tasks.community.find(t => t.platform === TARGET_PLATFORM && t.type === 'follow');
            const views = data.tasks.community.filter(t => t.platform === TARGET_PLATFORM && t.type === 'view');

            // 🔥 LOGIC: Premium Priority
            if (official) {
                // If Premium exists: Show Premium (Unlocked) + Community (Locked)
                setTaskOne({ ...official, isPremium: true });
                setTaskTwo(community || null);
            } else {
                // If No Premium: Show Community (Unlocked) directly
                setTaskOne(community || null);
                setTaskTwo(null);
            }
            setViewTasks(views);
        }
    } catch (error) { 
        console.error("Error fetching tasks:", error); 
    } finally { 
        setLoading(false); 
    }
  };

  // 🔥 2. ADVERTISEMENT FLOW
  const startAdFlow = (task) => {
      pendingTaskRef.current = task;
      setShowAd(true);
      setAdTimer(AD_DURATION);

      const interval = setInterval(() => {
          setAdTimer((prev) => {
              if (prev <= 1) {
                  clearInterval(interval);
                  finishAd();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const finishAd = () => {
      setTimeout(() => {
          setShowAd(false);
          if (pendingTaskRef.current) {
              openRealTask(pendingTaskRef.current);
          }
      }, 1000);
  };

  // 🔥 3. TASK EXECUTION LOGIC
  const openRealTask = (task) => {
      // Open the link
      window.open(task.url || task.targetUrl, '_blank');
      
      setProcessingId(task._id);
      setIsVerifying(true);
      
      // Determine timer based on task type
      let time = task.timeRequired || 60;
      if(task.type === 'follow') time = 10;
      
      setTaskTimer(time);

      const interval = setInterval(() => {
          time -= 1;
          setTaskTimer(time);
          if(time <= 0) {
              clearInterval(interval);
              // If it's a premium/official task, try auto-verify
              if(task.isPremium) handleVerify(task); 
          }
      }, 1000);
  };

  // 🔥 4. VERIFICATION & REWARD
  const handleVerify = async (task) => {
      const type = task.isPremium ? 'official' : 'community';
      
      try {
          const { data } = await api.post('/tasks/complete', { 
              id: task._id, 
              type, 
              timeTaken: 10, 
              deviceInfo: navigator.userAgent 
          });

          if(data.success) { 
              // Unlock logic
              if(task._id === taskOne?._id) {
                  setFirstTaskDone(true);
              }
              
              setIsVerifying(false); 
              setProcessingId(null); 
              alert(`🎉 Success! Points Added to your wallet.`); 
              
              // If standard task is done, refresh the list
              if(!task.isPremium && !taskTwo) {
                  setTaskOne(null); // Clear UI momentarily
                  fetchPlatformTasks();
              }
          }
      } catch (error) { 
          setIsVerifying(false); 
          alert("Verification Failed. Please verify you followed the page."); 
      }
  };

  // --- GATEKEEPER ---
  if (configLoading) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={50}/></div>;
  
  if (settings && settings.platforms && settings.platforms[TARGET_PLATFORM]?.isEnabled === false) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-red-200 dark:border-red-900/30 shadow-xl">
              <div className="p-6 bg-red-100 dark:bg-red-900/20 rounded-full mb-6 animate-pulse">
                  <Ban size={80} className="text-red-600 dark:text-red-500" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Service Unavailable</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">Facebook tasks are currently disabled by the administrator for maintenance.</p>
          </div>
      );
  }
  
  if (loading) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={50}/></div>;

  return (
    <div className="relative space-y-10 pb-32">
      
      {/* ==============================
          🔥 AD OVERLAY POPUP
      ============================== */}
      <AnimatePresence>
        {showAd && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[9999] bg-slate-900/95 flex flex-col items-center justify-center p-6 backdrop-blur-xl"
            >
                <div className="bg-black border border-slate-700 p-10 rounded-[2rem] max-w-xl w-full text-center relative overflow-hidden shadow-2xl">
                    {/* Top Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"></div>
                    
                    <div className="mb-8 flex justify-center">
                        <div className="p-4 bg-slate-800 rounded-full">
                            <Tv size={48} className="text-blue-400" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Sponsored Content</h2>
                    <p className="text-slate-400 text-base mb-8">Please watch this advertisement to unlock your task reward.</p>
                    
                    {/* Mock Ad Area */}
                    <div className="w-full aspect-video bg-slate-800 rounded-2xl border border-slate-700 mb-8 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50"></div>
                        <span className="text-slate-500 font-mono text-sm z-10 animate-pulse tracking-widest">GOOGLE ADS LOADING...</span>
                    </div>
                    
                    {/* Timer */}
                    <div className="flex items-center justify-center gap-3 text-white font-bold bg-slate-800 px-8 py-3 rounded-full border border-slate-700 shadow-lg">
                        <Loader2 className="animate-spin text-blue-500" size={20}/> 
                        <span className="tracking-wide">Closing in {adTimer} seconds...</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================
          🔥 HEADER SECTION (Premium UI)
      ============================== */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-900 p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/20 shadow-lg shadow-blue-500/5">
        <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-600/30 flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Facebook size={48} fill="currentColor" />
            </div>
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Facebook Exchange</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-500"/>
                    Follow pages & React to earn points.
                </p>
            </div>
        </div>
        
        <div className="mt-8 md:mt-0 flex flex-col gap-3">
            <div className="px-6 py-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                <Zap size={18} fill="currentColor"/> High Payout
            </div>
            <div className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                <ShieldCheck size={18}/> Verified Tasks
            </div>
        </div>
      </div>

      {/* ==============================
          🔥 MAIN TASK GRID (1 vs 2 Logic)
      ============================== */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-8 ${taskTwo ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}
      >
        
        {/* --- CARD 1 (ALWAYS UNLOCKED) --- */}
        {taskOne ? (
            <motion.div variants={cardVariants} className={`relative p-2 rounded-[2.5rem] transition-all duration-500 group ${firstTaskDone ? 'bg-green-500/20' : 'bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20'}`}>
                <div className="bg-white dark:bg-[#0B0F19] rounded-[2.2rem] p-8 h-full flex flex-col relative overflow-hidden">
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center border border-blue-100 dark:border-slate-700 shadow-inner text-blue-600">
                                <Facebook size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-xl line-clamp-1">{taskOne.title || "Facebook Page"}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">Follow</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Points Badge or Done Check */}
                        {firstTaskDone ? (
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full animate-bounce">
                                <CheckCircle size={32} />
                            </div>
                        ) : (
                            <div className="text-right">
                                <span className="block text-4xl font-black text-blue-600 tracking-tighter">+{taskOne.points}</span>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Points</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Visual Preview Box (Key Visual Element) */}
                    <div className="h-40 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {isVerifying && !firstTaskDone ? (
                            <div className="text-blue-600 dark:text-blue-400 animate-pulse flex flex-col items-center gap-3 font-bold z-10">
                                <Clock size={32}/> 
                                <span className="text-lg">Checking... {taskTimer}s</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 z-10 group-hover:scale-110 transition-transform duration-300">
                                <ExternalLink size={28} className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"/>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">Tap to Follow Page</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                        {firstTaskDone ? (
                            <button disabled className="w-full py-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 font-bold rounded-2xl flex items-center justify-center gap-2 border border-green-200 dark:border-green-900/30 cursor-default">
                                <CheckCircle size={20} /> Task Verified
                            </button>
                        ) : (
                            <button 
                                onClick={() => startAdFlow(taskOne)} 
                                disabled={isVerifying} 
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? "Processing..." : <><ThumbsUp size={22} fill="currentColor"/> Start Task</>}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        ) : (
            <div className="col-span-full py-24 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <AlertTriangle className="mx-auto mb-4 text-slate-300" size={56} />
                <p className="text-xl font-medium text-slate-500">No tasks available right now.</p>
                <button onClick={fetchPlatformTasks} className="mt-4 text-sm text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                    Refresh List
                </button>
            </div>
        )}

        {/* --- CARD 2 (LOCKED LOGIC) --- */}
        {taskTwo && (
            <motion.div variants={cardVariants} className={`relative p-1 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1117] transition-all duration-500 ${!firstTaskDone ? 'opacity-60 scale-95 grayscale' : 'opacity-100 scale-100 grayscale-0 shadow-2xl'}`}>
                
                {/* Lock Overlay */}
                {!firstTaskDone && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-black/70 backdrop-blur-[4px] rounded-[2.5rem]">
                        <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 shadow-xl ring-4 ring-white dark:ring-black">
                            <Lock size={36} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">LOCKED</p>
                        <p className="text-sm text-slate-500 font-medium">Complete first task to unlock</p>
                    </div>
                )}

                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Facebook className="text-slate-400 dark:text-slate-500" size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-xl line-clamp-1">{taskTwo.title || "User Page"}</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">Community Task</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-400 dark:text-slate-500">+10</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">PTS</span>
                        </div>
                    </div>
                    
                    {/* Placeholder Preview */}
                    <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-3xl mb-8 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <div className="text-slate-300 dark:text-slate-600 font-bold text-sm tracking-widest uppercase">Content Hidden</div>
                    </div>

                    <div className="mt-auto">
                        {processingId === taskTwo._id ? (
                            <button onClick={() => handleVerify(taskTwo)} disabled={taskTimer > 0} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg animate-pulse">
                                {taskTimer > 0 ? <><Clock size={20} className="animate-spin"/> Checking {taskTimer}s</> : "Claim Reward"}
                            </button>
                        ) : (
                            <button onClick={() => startAdFlow(taskTwo)} disabled={!firstTaskDone} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed group-hover:cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600">
                                {firstTaskDone ? "Start Task" : "Locked"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </motion.div>

      {/* ==============================
          🔥 WATCH & EARN SECTION
      ============================== */}
      <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                <Eye size={24} />
            </div>
            Watch & Earn Points
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewTasks.length > 0 ? viewTasks.map((task, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Play size={24} fill="currentColor"/>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">Watch Video</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{task.timeRequired || 60}s</span>
                                <span className="text-xs font-bold text-green-600">+10 Pts</span>
                            </div>
                        </div>
                    </div>
                    
                    {processingId === task._id ? (
                        <button onClick={() => handleVerify(task)} disabled={taskTimer > 0} className="px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-green-700 transition">
                            {taskTimer > 0 ? `${taskTimer}s` : "Claim"}
                        </button>
                    ) : (
                        <button onClick={() => startAdFlow(task)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white text-sm font-bold rounded-xl transition-all">
                            Start
                        </button>
                    )}
                </div>
            )) : (
                <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Info size={40} className="mx-auto mb-4 opacity-50"/>
                    <p className="text-lg">No promotional videos available.</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}