'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle, AlertTriangle, Send, Loader2, XCircle, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api'; 

export default function ForgotPassword() {
  // Form States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Logic States
  // 1: Email, 2: OTP, 3: New Password
  const [step, setStep] = useState(1); 
  const [status, setStatus] = useState('idle'); 
  const [serverError, setServerError] = useState('');

  // 🛡️ SECURITY
  const sanitizeInput = (text) => text.replace(/<[^>]*>?/gm, '').replace(/['";\\]/g, ''); 

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? null : "Invalid email address.";
  };

  // ১. Send OTP (FIXED: API Call Enabled)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setServerError('');
    const emailError = validateEmail(email);
    if (emailError) { setServerError(emailError); return; }

    setStatus('loading');
    try {
      // 🔥 আসল API কল (Uncommented)
      await api.post('/auth/send-otp', { email });
      
      setStatus('idle');
      setStep(2);
    } catch (err) {
      setStatus('error');
      setServerError(err.response?.data?.message || 'Failed to send OTP.');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  // ২. Verify OTP (FIXED: API Call Enabled)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError('');
    setStatus('loading');
    try {
      // 🔥 আসল API কল (Uncommented)
      await api.post('/auth/verify-otp', { email, otp });
      
      setStatus('idle');
      setStep(3); // Go to Password Reset Step
    } catch (err) {
      setStatus('error');
      setServerError(err.response?.data?.message || 'Invalid OTP. Try again.');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  // ৩. Reset Password (Already Connected)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if(newPassword.length < 6) {
        setServerError("Password must be at least 6 characters.");
        return;
    }

    setStatus('loading');
    
    try {
        // 🔥 API Call
        await api.post('/auth/reset-password-otp', { 
            email, 
            otp, 
            password: newPassword 
        });
        
        setStatus('success'); // All Done!
    } catch (err) {
        setStatus('error');
        setServerError(err.response?.data?.message || "Failed to update password.");
        setTimeout(() => setStatus('idle'), 3500);
    }
  };

  // 🔥 Animation Variants
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } }
  };

  // 🔥 Dynamic Background
  const getGradientClass = () => {
      if (status === 'success') return 'from-emerald-500/30 via-green-400/20 to-teal-300/10 dark:from-emerald-900/40 dark:via-green-900/20';
      if (status === 'error') return 'from-rose-500/30 via-red-400/20 to-orange-300/10 dark:from-rose-900/40 dark:via-red-900/20';
      if (status === 'loading') return 'from-indigo-500/30 via-purple-400/20 to-blue-300/10 dark:from-indigo-900/40 dark:via-purple-900/20';
      return 'from-blue-500/30 via-cyan-400/20 to-indigo-300/10 dark:from-blue-900/40 dark:via-cyan-900/20'; 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-24 md:pt-32 font-sans relative overflow-hidden transition-colors duration-500 bg-[#F8FAFC] dark:bg-black">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 shadow-2xl bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-900 shadow-slate-200/50 dark:shadow-none"
      >
        
        {/* === LEFT: FORM === */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative z-20 bg-white dark:bg-[#050505] transition-colors duration-500">
            
            <Link href="/auth/login" className="absolute top-8 left-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <ArrowLeft size={14} /> Back
            </Link>

            <div className="mt-10 mb-8">
                <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white tracking-tight">
                    {step === 1 && "Forgot Password?"}
                    {step === 2 && "Enter OTP"}
                    {step === 3 && "Reset Password"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {step === 1 && "We will send a code to your email."}
                    {step === 2 && `Code sent to ${email}`}
                    {step === 3 && "Create a strong new password."}
                </p>
            </div>

            <AnimatePresence>
                {serverError && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 p-3 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-lg border border-rose-500/20 text-center flex items-center justify-center gap-2">
                        <XCircle size={16}/> {serverError}
                    </motion.div>
                )}
            </AnimatePresence>

            {status === 'success' ? (
                // SUCCESS STATE
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-6">
                        <CheckCircle className="mx-auto text-emerald-500 mb-2" size={40} />
                        <p className="text-emerald-600 dark:text-emerald-400 text-lg font-bold">Password Updated!</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Your account is secure now.</p>
                    </div>
                    <Link href="/auth/login">
                        <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                            Login Now <ArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>
            ) : (
                // FORM STATES
                <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword} className="space-y-6">
                    
                    {/* STEP 1: EMAIL */}
                    {step === 1 && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input type="email" required value={email} onChange={(e) => setEmail(sanitizeInput(e.target.value))} placeholder="name@example.com" 
                                    className="w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Security Code</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(sanitizeInput(e.target.value))} placeholder="Enter 6-digit OTP" 
                                    className="w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-widest" 
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-indigo-500">Change Email</button>
                                <button type="button" className="text-xs text-indigo-600 font-bold hover:underline">Resend Code</button>
                            </div>
                        </div>
                    )}

                    {/* 🔥 STEP 3: NEW PASSWORD */}
                    {step === 3 && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(sanitizeInput(e.target.value))} placeholder="At least 6 characters" 
                                    className="w-full pl-11 pr-11 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none text-slate-400 hover:text-indigo-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={status === 'loading'}
                        className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group border
                        ${status === 'loading' ? 'bg-indigo-600 border-indigo-500 text-white opacity-80 cursor-wait' : 
                          'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:scale-[1.01]'}`}
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : 
                         step === 1 ? <>Send OTP <Send size={18} /></> : 
                         step === 2 ? <>Verify Code <ShieldCheck size={18} /></> : 
                         <>Update Password <CheckCircle size={18} /></>}
                    </button>
                </form>
            )}
        </div>

        {/* === RIGHT: ANIMATION PANEL === */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-slate-50 dark:bg-black">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br opacity-40 blur-[100px] transition-colors duration-1000 dark:hidden ${getGradientClass()}`} />
            <div className="absolute inset-0 bg-black hidden dark:block"></div>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900 rounded-full blur-[120px] hidden dark:block" />
            
            <div className="relative z-10 text-center w-full max-w-xs">
                <AnimatePresence mode="wait">
                    <motion.div key={status + step} variants={iconVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center">
                        <div className="w-40 h-40 flex items-center justify-center mb-6 relative">
                            {(status === 'loading') && ( <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-full" /> )}
                            
                            {status === 'idle' && step === 1 && <Mail size={80} className="text-indigo-500 drop-shadow-lg" />}
                            {status === 'idle' && step === 2 && <KeyRound size={80} className="text-amber-500 drop-shadow-lg" />}
                            {status === 'idle' && step === 3 && <Lock size={80} className="text-purple-500 drop-shadow-lg" />}
                            {status === 'success' && <CheckCircle size={80} className="text-emerald-500 drop-shadow-lg" />}
                            {status === 'error' && <AlertTriangle size={80} className="text-rose-500 drop-shadow-lg" />}
                        </div>

                        <h2 className={`text-2xl font-bold mb-2 transition-colors ${status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                            {status === 'idle' && step === 1 && "Password Recovery"}
                            {status === 'idle' && step === 2 && "Verification"}
                            {status === 'idle' && step === 3 && "Secure New Password"}
                            {status === 'success' && "All Done!"}
                            {status === 'error' && "Action Failed"}
                        </h2>
                        
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {status === 'idle' && step === 1 && "Enter your email to begin."}
                            {status === 'idle' && step === 2 && "Check your inbox for the code."}
                            {status === 'idle' && step === 3 && "Make it hard to guess."}
                            {status === 'success' && "You can login with new password."}
                            {status === 'error' && "Please double check your input."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

      </motion.div>
    </div>
  );
}