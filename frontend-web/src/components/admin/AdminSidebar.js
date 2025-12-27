'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 🔥 NEW: 'List' icon import kora hoyeche Task Manager er jonno
import { LayoutDashboard, Users, CreditCard, Shield, Settings, LogOut, List } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
        { name: 'User Management', icon: Users, href: '/admin/users' },
        // 🔥 NEW: Task Manager Option Added Here
        { name: 'Task Manager', icon: List, href: '/admin/tasks' },
        { name: 'Transactions', icon: CreditCard, href: '/admin/transactions' },
        { name: 'Security Logs', icon: Shield, href: '/admin/security' },
        { name: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex-col hidden md:flex shadow-2xl z-50">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Shield size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wider text-white">
                        ADMIN<span className="text-blue-500">PANEL</span>
                    </h1>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group mb-1 ${
                                isActive 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                            }`}>
                                <item.icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}/>
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <button 
                    onClick={() => {
                        sessionStorage.removeItem('admin_secure');
                        window.location.href = '/dashboard';
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Exit Panel</span>
                </button>
            </div>
        </div>
    );
}