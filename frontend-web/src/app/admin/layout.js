'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar'; 
import api from '../../services/api'; 
import { Toaster, toast } from 'react-hot-toast';
import { Lock, Mail, Loader2, Send, Unlock } from 'lucide-react';

export default function AdminLayout({ children }) {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [otpInput, setOtpInput] = useState('');
    const [initialLoad, setInitialLoad] = useState(true);

    // ১. সেশন চেক (পেজ লোড হলে)
    useEffect(() => {
        const checkSession = () => {
            if (sessionStorage.getItem('admin_secure') === 'true') {
                setIsVerified(true);
            }
            setInitialLoad(false);
        };
        checkSession();
    }, []);

    // ২. ওটিপি পাঠানো (আপনার ওয়ার্কিং কোড থেকে নেওয়া)
    const handleSendOTP = async () => {
        setLoading(true);
        const loadingToast = toast.loading("Sending Verification Code... 🚀");
        try {
            const response = await api.get('/auth/request-admin-otp');
            if(response.data.success) {
                toast.success("Code sent to your Email! 📧", { id: loadingToast });
                setStep(2); 
            } else {
                toast.error(response.data.message, { id: loadingToast });
            }
        } catch (err) {
            toast.error("Server Connection Failed!", { id: loadingToast });
        } finally { setLoading(false); }
    };

    // ৩. ওটিপি ভেরিফাই (আপনার ওয়ার্কিং কোড থেকে নেওয়া)
    const handleVerify = async (e) => {
        e.preventDefault();
        if(otpInput.length < 6) return toast.error("Enter 6-digit code!");
        
        setLoading(true);
        const verifyToast = toast.loading("Verifying... 🔐");
        try {
            const { data } = await api.post('/auth/verify-admin-otp', { otp: otpInput });
            if(data.success) {
                toast.success("Access Granted! 🎉", { id: verifyToast });
                sessionStorage.setItem('admin_secure', 'true');
                setIsVerified(true); // ভেরিফাইড হলে তবেই সাইডবার আসবে
            } else {
                toast.error("Invalid Code! ❌", { id: verifyToast });
            }
        } catch (err) {
            toast.error("Verification Failed! ❌", { id: verifyToast });
        } finally { setLoading(false); }
    };

    // লোডিং অবস্থায় ব্ল্যাংক স্ক্রিন (ক্ষণিকের জন্য)
    if (initialLoad) return <div className="h-screen bg-slate-950"></div>;

    // 🔒 লক স্ক্রিন (এখানে কোনো Sidebar নেই)
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <Toaster position="top-right" />
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-blue-500/30 max-w-md w-full text-center relative overflow-hidden">
                    {/* ব্যাকগ্রাউন্ড ইফেক্ট */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 transition-all ${step === 1 ? 'bg-blue-600/20 ring-blue-500/10' : 'bg-yellow-600/20 ring-yellow-500/10'}`}>
                        {step === 1 ? <Lock size={40} className="text-blue-400" /> : <Mail size={40} className="text-yellow-400 animate-pulse"/>}
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Security Check</h2>
                    <p className="text-gray-400 text-sm mb-8">This area is restricted to Super Admins only.</p>

                    {step === 1 ? (
                        <button onClick={handleSendOTP} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex justify-center gap-2 transition-all">
                            {loading ? <Loader2 className="animate-spin"/> : <><Send size={18} /> Send Code</>}
                        </button>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))} placeholder="• • • • • •" className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 text-center text-2xl tracking-[0.5em] focus:border-yellow-500 outline-none text-white" maxLength={6} autoFocus />
                            <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl flex justify-center gap-2 transition-all">
                                {loading ? <Loader2 className="animate-spin"/> : <><Unlock size={18} /> Verify</>}
                            </button>
                        </form>
                    )}
                    
                    <button onClick={() => window.location.href = '/dashboard'} className="mt-6 text-gray-500 text-xs hover:text-white">← Exit to User Dashboard</button>
                </div>
            </div>
        );
    }

    // ✅ আনলকড অবস্থা (শুধুমাত্র ভেরিফাই হলেই সাইডবার আসবে)
    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
            <Toaster position="top-right" />
            
            {/* সাইডবার এখন শুধু Verified হলেই রেন্ডার হবে */}
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-slate-950 relative">
                <div className="p-4 md:p-8 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}