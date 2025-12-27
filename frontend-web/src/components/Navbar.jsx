'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // পাথ চেক করার জন্য
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes'; 

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  // ১. হাইড্রেশন এবং স্ক্রল ফিক্স
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Earn Points', path: '/dashboard/earn' },
    { name: 'Promote', path: '/dashboard/promote' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard' },
  ];

  // 🔥🔥 মেইন ফিক্স: যদি আমরা অ্যাডমিন প্যানেলে (/admin) থাকি, তবে Navbar রেন্ডার হবে না
  if (pathname && pathname.startsWith('/admin')) {
      return null;
  }

  // লোডিং অবস্থায় কিছু দেখাবে না
  if (!mounted) return null;

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-6xl flex justify-between items-center rounded-2xl border transition-all duration-300 ${
          isScrolled 
            ? 'py-3 px-6 bg-white/85 dark:bg-slate-900/85 border-slate-200 dark:border-slate-700 shadow-xl shadow-indigo-500/5' 
            : 'py-4 px-8 bg-white/60 dark:bg-slate-900/60 border-white/50 dark:border-slate-800 shadow-sm'
        }`}
        style={{
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        }}
      >
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-slate-900 dark:bg-indigo-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-md">
             <Rocket size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hyper<span className="text-indigo-600 dark:text-indigo-400">Boost</span>
          </span>
        </Link>

        {/* MIDDLE MENU */}
        <div 
            className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-white/60 dark:border-slate-700 shadow-inner relative"
            onMouseLeave={() => setHoveredTab(null)}
        >
          {navLinks.map((item) => {
            const isActive = pathname === item.path; 
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onMouseEnter={() => setHoveredTab(item.path)}
                className={`relative px-5 py-2 text-sm font-bold rounded-lg transition-colors duration-200 z-10 ${
                   isActive 
                   ? 'text-white' 
                   : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-slate-900 dark:bg-indigo-600 rounded-lg shadow-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {hoveredTab === item.path && !isActive && (
                  <motion.span
                    layoutId="hover-pill"
                    className="absolute inset-0 bg-slate-200/60 dark:bg-slate-700/60 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -2 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Buttons (Auth + Theme) */}
        <div className="hidden md:flex items-center gap-4">
          <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/auth/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Log in
          </Link>
          <Link href="/auth/register" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg hover:-translate-y-0.5">
            GET STARTED
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-3">
            <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-slate-900 dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col gap-2 md:hidden origin-top z-40"
          >
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`text-lg font-bold py-3 px-4 rounded-lg transition-colors ${
                    pathname === item.path 
                    ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                 <Link href="/auth/login" className="w-full text-center py-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    Log in
                 </Link>
                 <Link href="/auth/register" className="w-full text-center py-3 font-bold text-white bg-indigo-600 rounded-lg">
                    Get Started
                 </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}