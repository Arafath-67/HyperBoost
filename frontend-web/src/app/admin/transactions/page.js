'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, XCircle, Search, Filter, Loader2, 
    CreditCard, Smartphone, ShoppingBag, Crown, 
    Calendar, User, AlertCircle 
} from 'lucide-react';
import api from '../../../services/api';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // all, pending, completed, rejected

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Backend route to fetch all transactions
            const { data } = await api.get('/admin/transactions/all');
            if(data.success) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 HANDLE APPROVAL
    const handleAction = async (id, status) => {
        if(!confirm(`Are you sure you want to ${status} this transaction?`)) return;

        try {
            const { data } = await api.post('/admin/transactions/update-status', { id, status });
            if(data.success) {
                alert(`Transaction ${status} successfully!`);
                // Update UI locally
                setTransactions(prev => prev.map(t => t._id === id ? { ...t, status } : t));
            }
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    // Filter Logic
    const filteredTrx = filterStatus === 'all' 
        ? transactions 
        : transactions.filter(t => t.status === filterStatus);

    // Helpers
    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getTypeIcon = (category) => {
        return category === 'membership' 
            ? <Crown size={18} className="text-orange-500"/> 
            : <ShoppingBag size={18} className="text-blue-500"/>;
    };

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Transaction Manager</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review & Approve Payment Requests</p>
                </div>
                
                {/* Filter Tabs */}
                <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex shadow-sm">
                    {['all', 'pending', 'completed', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                filterStatus === status 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
            ) : (
                <div className="space-y-4">
                    {filteredTrx.length > 0 ? filteredTrx.map((trx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={trx._id} 
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6"
                        >
                            {/* Left: User & Type */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`p-4 rounded-xl ${trx.paymentMethod === 'mobile' ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {trx.paymentMethod === 'mobile' ? <Smartphone size={24}/> : <CreditCard size={24}/>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        {trx.amount} BDT
                                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(trx.status)}`}>
                                            {trx.status}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            {getTypeIcon(trx.category)} {trx.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14}/> {trx.userName || "User"}
                                        </span>
                                        <span className="hidden md:flex items-center gap-1">
                                            <Calendar size={14}/> {new Date(trx.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Trx Details */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-100 dark:border-slate-700 w-full md:w-auto text-center md:text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                                <p className="font-mono font-bold text-slate-700 dark:text-slate-300 select-all">{trx.transactionId}</p>
                                {trx.mobileGateway && (
                                    <span className="text-xs font-bold text-pink-500 mt-1 block uppercase">{trx.mobileGateway}</span>
                                )}
                            </div>

                            {/* Right: Actions (Only for Pending) */}
                            {trx.status === 'pending' ? (
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => handleAction(trx._id, 'approved')}
                                        className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                                    >
                                        <CheckCircle size={18}/> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(trx._id, 'rejected')}
                                        className="flex-1 md:flex-none px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-red-100"
                                    >
                                        <XCircle size={18}/> Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="text-right w-full md:w-auto px-6">
                                    <span className="text-sm font-bold text-slate-400">Processed</span>
                                </div>
                            )}

                        </motion.div>
                    )) : (
                        <div className="text-center py-20 text-slate-400">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-50"/>
                            <p>No transactions found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}