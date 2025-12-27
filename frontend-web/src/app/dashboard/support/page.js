'use client';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, Send, FileText } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Support Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Need help? We are here to assist you 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* বাম পাশ: ফর্ম */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // 🔥 Dark Mode: bg-slate-900 border-slate-800
            className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm transition-colors"
        >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-indigo-600 dark:text-indigo-400" /> New Ticket
            </h3>

            <form className="space-y-6">
                
                {/* Issue Type */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Issue Type</label>
                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-colors">
                        <option>Points not added</option>
                        <option>Campaign Issue</option>
                        <option>Account & Billing</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                    <input 
                        type="text" 
                        placeholder="Briefly describe the issue" 
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-colors"
                    />
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</label>
                    <textarea 
                        rows="5"
                        placeholder="Provide details..." 
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium resize-none transition-colors"
                    ></textarea>
                </div>

                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2">
                    <Send size={18} /> Submit Ticket
                </button>

            </form>
        </motion.div>

        {/* ডান পাশ: FAQ & Info */}
        <div className="space-y-6">
            
            {/* FAQ Card */}
            {/* 🔥 Dark Mode: bg-indigo-900/10 border-indigo-900/30 */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 transition-colors">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                    <HelpCircle size={18} /> Quick FAQ
                </h4>
                <ul className="space-y-3 text-sm text-indigo-800 dark:text-indigo-300">
                    <li className="flex gap-2">
                        <span className="font-bold">•</span> Points update instantly, but YouTube API may take 5-10 mins.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">•</span> Campaigns cannot be cancelled once started.
                    </li>
                </ul>
            </div>

            {/* Resources Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-400">
                        <span>Terms of Service</span> <FileText size={16} />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-400">
                        <span>Privacy Policy</span> <FileText size={16} />
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}