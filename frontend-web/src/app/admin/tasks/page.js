'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Search, Filter, Youtube, Facebook, Instagram, 
    Music, CheckCircle, X, Loader2, Save, LayoutGrid, List,
    User, ShieldCheck, Clock
} from 'lucide-react';
import api from '../../../services/api';

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, official, user_campaign

    // Form State for Creating Official Task
    const [formData, setFormData] = useState({
        platform: 'youtube',
        actionType: 'subscribe',
        targetUrl: '',
        pointsReward: 10,
        timeRequired: 60,
        isOfficial: true // Admin tasks represent official tasks
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch both Official Tasks & User Campaigns
    const fetchTasks = async () => {
        try {
            // Assuming backend has a route to get ALL tasks (official + user campaigns)
            // If separate, we might need two calls, but let's assume one unified endpoint or filtered list
            const { data } = await api.get('/admin/tasks/all'); 
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    // Create Official Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/admin/tasks/create', formData);
            if (data.success) {
                alert("Official Task Created Successfully!");
                setShowModal(false);
                fetchTasks(); // Refresh
                setFormData({ ...formData, targetUrl: '' });
            }
        } catch (error) {
            alert("Failed to create task");
        }
    };

    // Delete Task (Official or User Campaign)
    const handleDelete = async (id) => {
        if(!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/admin/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    // Helper: Icons
    const getPlatformIcon = (p) => {
        switch(p) {
            case 'youtube': return <Youtube size={20} className="text-red-600"/>;
            case 'facebook': return <Facebook size={20} className="text-blue-600"/>;
            case 'instagram': return <Instagram size={20} className="text-pink-600"/>;
            case 'tiktok': return <Music size={20} className="text-cyan-500"/>;
            default: return <LayoutGrid size={20}/>;
        }
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 dark:bg-[#0B0F19] min-h-screen text-slate-900 dark:text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">Task Manager</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage Official Tasks & User Campaigns.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20}/> Create Official Task
                </button>
            </div>

            {/* TASK LIST */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length > 0 ? tasks.map((task) => (
                        <motion.div 
                            layout
                            key={task._id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all shadow-sm group relative"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                        {getPlatformIcon(task.platform)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg line-clamp-1 capitalize">{task.platform} Task</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {task.isOfficial ? (
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
                                                    <ShieldCheck size={12}/> Official
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                                                    <User size={12}/> User Campaign
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-blue-600">{task.pointsReward || task.cpc || 10}</span>
                                    <span className="text-xs text-slate-400 font-bold">PTS</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Action</span>
                                    <span className="font-bold capitalize">{task.actionType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Target Amount</span>
                                    <span className="font-bold">{task.targetAmount || '∞'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Timer</span>
                                    <span className="font-bold flex items-center gap-1"><Clock size={14}/> {task.timeRequired || 60}s</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Link</span>
                                    <a href={task.targetUrl} target="_blank" className="text-blue-500 hover:underline truncate max-w-[120px] block">View Link ↗</a>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleDelete(task._id)}
                                className="w-full py-3 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                <Trash2 size={18}/> Delete Task
                            </button>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            <List size={48} className="mx-auto mb-4 opacity-50"/>
                            <p>No active tasks found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- CREATE OFFICIAL TASK MODAL --- */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
                            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><X size={24}/></button>
                            
                            <h2 className="text-2xl font-bold mb-6">Create Official Task</h2>
                            
                            <form onSubmit={handleCreateTask} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-2">Platform</label>
                                        <select 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none"
                                            value={formData.platform}
                                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-2">Action</label>
                                        <select 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none"
                                            value={formData.actionType}
                                            onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                                        >
                                            <option value="subscribe">Subscribe</option>
                                            <option value="follow">Follow</option>
                                            <option value="view">View</option>
                                            <option value="like">Like</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2">Target URL</label>
                                    <input required type="url" placeholder="https://..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none" 
                                    value={formData.targetUrl} onChange={e => setFormData({...formData, targetUrl: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-2">Points Reward</label>
                                        <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none" 
                                        value={formData.pointsReward} onChange={e => setFormData({...formData, pointsReward: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-2">Timer (s)</label>
                                        <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none" 
                                        value={formData.timeRequired} onChange={e => setFormData({...formData, timeRequired: e.target.value})} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all">
                                    <Save size={20}/> Publish Task
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}