'use client';
import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../../services/api'; // API Import

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState([]); // 1-3 Rank
  const [restUsers, setRestUsers] = useState([]); // 4-20 Rank
  const [currentUser, setCurrentUser] = useState(null); // নিজের র‍্যাংক

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/auth/leaderboard'); // Backend API Call
      if (data.success) {
        const users = data.leaderboard;
        
        // ১. সেরা ৩ জনকে আলাদা করি (Podium)
        // আমরা এরেঞ্জমেন্ট করব: Rank 2 (Left), Rank 1 (Center), Rank 3 (Right)
        const podium = [
            users[1] || { username: 'Empty', points: 0 }, // Rank 2
            users[0] || { username: 'Empty', points: 0 }, // Rank 1
            users[2] || { username: 'Empty', points: 0 }  // Rank 3
        ];
        
        // কালার সেট করা
        podium[0].color = 'bg-slate-300 dark:bg-slate-700'; // Silver
        podium[0].rank = 2;
        podium[1].color = 'bg-yellow-400 dark:bg-yellow-500'; // Gold
        podium[1].rank = 1;
        podium[2].color = 'bg-orange-300 dark:bg-orange-600'; // Bronze
        podium[2].rank = 3;

        setTopUsers(podium);
        setRestUsers(users.slice(3)); // বাকিরা (4 থেকে শেষ পর্যন্ত)
        
        // (Optional) নিজের ইউজার ডাটা আলাদা API থেকে এনে এখানে ম্যাচ করতে হবে
        // আপাতত আমি ধরে নিচ্ছি ইউজারের লগইন করা আছে এবং লোকাল স্টোরেজে তথ্য আছে
      }
    } catch (error) {
      console.error("Leaderboard Error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="space-y-12 pb-24">
      
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Top Performers</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Users earning the most points.</p>
      </div>

      {/* ১. পোডিয়াম (Top 3) - Dynamic Data */}
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-12">
        {topUsers.map((user, index) => (
            <div key={index} className="flex flex-col items-center">
                
                {/* মুকুট (Rank 1) */}
                {user.rank === 1 && <Crown size={32} className="text-yellow-500 mb-2 animate-bounce" fill="currentColor" />}
                
                {/* অ্যাভাটার */}
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-slate-950 shadow-xl z-10 transition-colors uppercase`}>
                    {user.username?.charAt(0) || '?'}
                </div>
                
                {/* পোডিয়াম বক্স */}
                <div className={`w-24 md:w-32 ${user.rank === 1 ? 'h-48' : user.rank === 2 ? 'h-36' : 'h-24'} ${user.color} rounded-t-2xl mt-[-10px] pt-8 flex flex-col items-center justify-end pb-4 shadow-lg transition-colors`}>
                    <span className={`text-3xl font-extrabold text-white opacity-50`}>{user.rank}</span>
                </div>

                <div className="text-center mt-3">
                    <h3 className="font-bold text-slate-900 dark:text-white max-w-[100px] truncate">{user.username}</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{user.totalEarnedPoints || user.points} PTS</p>
                </div>
            </div>
        ))}
      </div>

      {/* ২. বাকিদের লিস্ট (White Strip Table) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden max-w-4xl mx-auto transition-colors">
        {restUsers.length > 0 ? (
            restUsers.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4">
                        <span className="w-8 text-center font-bold text-slate-400">#{index + 4}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 uppercase">
                            {user.username.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{user.username}</span>
                        {/* VIP Badge Logic */}
                        {user.isPremium && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">VIP</span>}
                    </div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.totalEarnedPoints || user.points} PTS</span>
                </div>
            ))
        ) : (
            <div className="p-8 text-center text-slate-500">Not enough data for leaderboard yet.</div>
        )}
      </div>

      {/* ৩. আপনার র‍্যাংক (Sticky Footer) */}
      {/* এটি দেখানোর জন্য আপনাকে /auth/me কল করে ইউজারের র‍্যাংক ক্যালকুলেট করতে হবে। আপাতত স্ট্যাটিক রাখলাম বা আপনি চাইলে রিমুভ করতে পারেন */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-slate-700 dark:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
                <span className="font-bold text-slate-400">#--</span>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">ME</div>
                <div>
                    <p className="font-bold text-sm">You</p>
                    <p className="text-xs text-slate-400">Check profile for points</p>
                </div>
            </div>
            <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} /> Keep Earning!
            </span>
        </div>
      </div>

    </div>
  );
}