'use client';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Instagram, Music, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Link your social accounts to verify tasks automatically.</p>
      </div>

      {/* Warning Alert */}
      {/* 🔥 Dark Mode: bg-amber-900/10 border-amber-900/30 text-amber-200 */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 text-amber-800 dark:text-amber-200 text-sm font-bold flex items-center gap-3 transition-colors">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        You must verify tasks using the accounts linked below.
      </div>

      <div className="space-y-6">
        
        {/* YouTube Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Youtube className="text-red-600" size={18} /> YouTube Channel ID
            </label>
            <input 
                type="text" 
                placeholder="UC..." 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors font-mono"
            />
        </div>

        {/* Facebook Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Facebook className="text-blue-600" size={18} /> Facebook Profile Link
            </label>
            <input 
                type="text" 
                placeholder="https://facebook.com/username" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors font-mono"
            />
        </div>

        {/* Instagram Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Instagram className="text-pink-600" size={18} /> Instagram Handle
            </label>
            <input 
                type="text" 
                placeholder="@username" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-500 transition-colors font-mono"
            />
        </div>

        {/* TikTok Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Music className="text-slate-900 dark:text-white" size={18} /> TikTok Username
            </label>
            <input 
                type="text" 
                placeholder="@username" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-500 transition-colors font-mono"
            />
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        {/* 🔥 Dark Mode Button: Indigo color used for better visibility */}
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-lg">
            <Save size={18} /> Save Changes
        </button>
      </div>

    </div>
  );
}