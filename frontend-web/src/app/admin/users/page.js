'use client';
import { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, MoreVertical, Trash2, Mail } from 'lucide-react';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ১. ইউজার লিস্ট লোড করা
    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users'); // ব্যাকএন্ড থেকে সব ইউজার আনবে
            if (data.success) {
                setUsers(data.users);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ২. ব্যান/আনব্যান হ্যান্ডলার
    const handleBanToggle = async (userId, currentStatus) => {
        const confirmMsg = currentStatus 
            ? "Are you sure you want to UNBAN this user? 🟢" 
            : "Are you sure you want to BAN this user? 🔴";

        if (!window.confirm(confirmMsg)) return;

        try {
            const { data } = await api.put(`/admin/users/ban/${userId}`);
            if (data.success) {
                toast.success(data.message);
                fetchUsers(); // লিস্ট রিফ্রেশ
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };

    // সার্চ ফিল্টার
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-slate-400">
            <span className="loading loading-spinner loading-lg"></span> Loading User Data...
        </div>
    );

    return (
        <div className="space-y-6">
            {/* হেডার এবং সার্চ */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-blue-500" /> User Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Total Members: <span className="text-white font-bold">{users.length}</span></p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    />
                </div>
            </div>

            {/* ইউজার টেবিল */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                                <th className="p-5 font-medium">User Info</th>
                                <th className="p-5 font-medium">Role</th>
                                <th className="p-5 font-medium">Points</th>
                                <th className="p-5 font-medium text-center">Status</th>
                                <th className="p-5 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-800/50 transition duration-200">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase shadow-lg">
                                                    {user.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{user.username}</p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                                        <Mail size={10}/> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                user.role === 'admin' 
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                                : 'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-5 text-white font-mono">
                                            {user.points || 0} PTS
                                        </td>
                                        <td className="p-5 text-center">
                                            {user.security?.isBanned ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                                                    <Ban size={12}/> BANNED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">
                                                    <CheckCircle size={12}/> ACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            {user.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleBanToggle(user._id, user.security?.isBanned)}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        user.security?.isBanned
                                                        ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white'
                                                    }`}
                                                    title={user.security?.isBanned ? "Unban User" : "Ban User"}
                                                >
                                                    {user.security?.isBanned ? <CheckCircle size={18}/> : <Ban size={18}/>}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}