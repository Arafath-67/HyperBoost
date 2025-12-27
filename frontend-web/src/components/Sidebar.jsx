'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // useRouter যোগ করা হলো
import { useState, useEffect } from 'react';
import { LayoutDashboard, PlayCircle, Rocket, Wallet, Trophy, LifeBuoy, User, Settings, LogOut, BarChart3 } from 'lucide-react';
import api from '../services/api'; // ডাটা আনার জন্য

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // রাউটার ইনিশিয়াল করা হলো
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null); // ইউজার ডাটা রাখার জন্য স্টেট

  useEffect(() => {
    setMounted(true);
    
    // 🔥 ইউজারের নাম আনার জন্য ছোট API কল
    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            if(data.success) setUser(data.user);
        } catch (err) {
            console.error("Sidebar User Load Failed");
        }
    };
    fetchUser();
  }, []);

  // 🚪 লগআউট ফাংশন
  const handleLogout = () => {
      // ১. টোকেন ডিলিট
      localStorage.removeItem('token');
      // ২. লগইন পেজে রিডাইরেক্ট
      router.push('/auth/login');
  };

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Earn Points', path: '/dashboard/earn', icon: PlayCircle },
    { name: 'Promote', path: '/dashboard/promote', icon: Rocket },
    { name: 'Wallet', path: '/dashboard/wallet', icon: Wallet },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Manage Ads', path: '/dashboard/manage', icon: BarChart3 },
  ];

  const bottomItems = [
    { name: 'Support', path: '/dashboard/support', icon: LifeBuoy },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-300">
      
      {/* লোগো */}
      <div className="p-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md">
            <Rocket size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Hyper<span className="text-indigo-600">Boost</span>
        </span>
      </div>

      {/* ইউজার কার্ড (Dynamic Data) */}
      <div className="px-4 py-6">
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold uppercase">
                {user?.username ? user.username.substring(0, 2) : 'US'}
            </div>
            <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.username || 'Loading...'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.isPremium ? 'Premium' : 'Free Plan'}
                </p>
            </div>
        </div>
      </div>

      {/* মেনু */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'} />
              {item.name}
            </Link>
          );
        })}

        <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>

        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System</p>
        {bottomItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white ${pathname === item.path ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''}`}
          >
            <item.icon size={20} className="text-slate-400" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* 🔥 লগআউট বাটন (Functional) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
            <LogOut size={20} />
            Logout
        </button>
      </div>

    </aside>
  );
}