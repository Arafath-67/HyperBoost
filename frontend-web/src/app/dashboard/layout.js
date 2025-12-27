'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🛡️ SECURITY GUARD: Check for Token
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // টোকেন না থাকলে সোজা লগইন পেজে পাঠাও
      router.push('/auth/login');
    } else {
      // টোকেন থাকলে গেট খোলো
      setIsAuthenticated(true);
    }
  }, [router]);

  // চেকিং চলাকালীন লোডিং দেখাবে
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      
      {/* সাইডবার */}
      <Sidebar />

      <main className="flex-1 ml-64 px-8 pb-8 pt-32">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
      
    </div>
  );
}