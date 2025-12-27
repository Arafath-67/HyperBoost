'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Safe Icons
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff, Loader2, Cpu, Search, Gift, AlertTriangle, Moon } from 'lucide-react';
import api from '../../../services/api'; 

export default function LoginPage() {
  const router = useRouter();
  
  // States
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Logic States
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'error'
  const [serverError, setServerError] = useState('');

  // 🛡️ SECURITY: ইনপুট স্যানিটাইজেশন
  const sanitizeInput = (text) => {
    let cleanText = text.replace(/<[^>]*>?/gm, ''); // HTML Tags Remove
    cleanText = cleanText.replace(/['";\\]/g, '');   // SQL Injection Char Remove
    return cleanText;
  };

  // 🛡️ SECURITY: ইমেইল ভ্যালিডেশন
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Invalid email address.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = sanitizeInput(value);
    setFormData({ ...formData, [name]: cleanValue });
    
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setStatus('scanning');

    try {
        await new Promise(r => setTimeout(r, 2500)); 
        
        const response = await api.post('/auth/login', formData);
        
        setStatus('success');
        localStorage.setItem('token', response.data.token);
        if(response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user));

        setTimeout(() => router.push('/dashboard'), 2000);

    } catch (err) {
        console.error(err);
        setStatus('error');
        setServerError(err.response?.data?.message || "Invalid credentials.");
        setTimeout(() => setStatus('idle'), 3500);
    }
  };

  // 🔥 PREVIOUS ANIMATION VARIANTS (Restored)
  const botVariants = {
    idle: { y: [0, -10, 0], rotate: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
    scanning: { scale: 1.1, x: [-5, 5, -5, 5, 0], transition: { repeat: Infinity, duration: 0.2 } }, // Shaking effect
    success: { y: [0, -20, 0], scale: [1, 1.2, 1], rotate: [0, -10, 10, 0], transition: { repeat: Infinity, duration: 0.8 } }, // Happy dance
    error: { scale: 0.9, rotate: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } }
  };

  // 🔥 Dynamic Panel Background Colors (Restored)
  const getPanelBackground = () => {
    if (status === 'success') return 'bg-green-100 dark:bg-green-950/30';
    if (status === 'error') return 'bg-red-100 dark:bg-red-950/30';
    if (status === 'scanning') return 'bg-indigo-100 dark:bg-indigo-950/30';
    return 'bg-[#F1F5F9] dark:bg-[#020617]'; // Idle
  };

  // 🔥 Dynamic Glowing Orb Colors (Restored)
  const getOrbColor = () => {
    if (status === 'success') return 'bg-green-500/30 dark:bg-green-500/20';
    if (status === 'error') return 'bg-red-500/30 dark:bg-red-600/20';
    if (status === 'scanning') return 'bg-indigo-600/30 dark:bg-indigo-500/20';
    return 'bg-indigo-400/30 dark:bg-indigo-900/20'; // Idle
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-24 md:pt-32 font-sans relative overflow-hidden transition-colors duration-500 bg-[#F1F5F9] dark:bg-[#020617]">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Main Floating Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 transition-colors duration-500 shadow-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-slate-300 dark:shadow-black/50"
      >
        
        {/* =======================
            LEFT SIDE: FORM
        ======================= */}
        <div className="p-8 md:p-12 relative z-20 flex flex-col justify-center bg-white dark:bg-[#0f172a] transition-colors duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900 dark:text-white">
                    Welcome Back
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Secure access to your dashboard.</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors font-bold text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Chrome size={18} /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors font-bold text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Github size={18} /> GitHub
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white dark:bg-[#0f172a] text-slate-400 dark:text-slate-500">Or login with</span></div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {serverError && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 p-3 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-lg border border-rose-500/20 text-center flex items-center justify-center gap-2">
                        <AlertTriangle size={16}/> {serverError}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" size={18} />
                        <input 
                            name="email" type="email" onChange={handleChange} placeholder="name@example.com" value={formData.email}
                            className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                            ${errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`} 
                        />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 ml-1">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" size={18} />
                        <input 
                            name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" value={formData.password}
                            className={`w-full pl-11 pr-11 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                            ${errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-[10px] text-rose-500 ml-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Remember me</span>
                    </label>
                    {/* 🔥 FIXED LINK HERE */}
                    <Link href="/auth/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline">Forgot?</Link>
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'scanning' || status === 'success'}
                    className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm border
                    ${status === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
                      'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:scale-[1.01]'}`}
                >
                    {status === 'scanning' ? <>Wake up Bot! <Loader2 className="animate-spin" size={20} /></> : status === 'success' ? <>Allowed! 🎉</> : <>Sign In <ArrowRight size={18} /></>}
                </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-500">
                New here? <Link href="/auth/register" className="font-bold hover:underline text-indigo-600 dark:text-indigo-400">Create Account</Link>
            </p>
        </div>

        {/* =======================
            RIGHT SIDE: ROBOT ANIMATION 🤖 (Restored)
        ======================= */}
        <div className={`hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden transition-colors duration-700 ${getPanelBackground()}`}>
            
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

            {/* Glowing Orb */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${getOrbColor()}`} 
            />

            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                    
                    {/* 🤖 STATE 1: IDLE */}
                    {status === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex flex-col items-center">
                            <div className="relative">
                                <motion.div variants={botVariants} animate="idle">
                                    <Cpu size={100} className="text-slate-400 dark:text-slate-600" />
                                </motion.div>
                                <motion.div animate={{ y: -30, x: 20, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} className="absolute top-0 right-0">
                                    <Moon size={30} className="text-indigo-400 dark:text-indigo-300" />
                                </motion.div>
                            </div>
                            <h2 className="text-2xl font-bold mt-6 mb-2 text-slate-700 dark:text-slate-200">Security Bot is Napping</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs italic">"Enter details to wake me up..."</p>
                        </motion.div>
                    )}

                    {/* 🤖 STATE 2: SCANNING */}
                    {status === 'scanning' && (
                        <motion.div key="scanning" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="flex flex-col items-center">
                            <div className="relative">
                                <motion.div variants={botVariants} animate="scanning">
                                    <Cpu size={110} className="text-indigo-500 dark:text-indigo-400" />
                                </motion.div>
                                <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute -bottom-4 -right-4 bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20">
                                    <Search size={40} className="text-indigo-600 dark:text-indigo-300" />
                                </motion.div>
                            </div>
                            <h2 className="text-2xl font-bold mt-8 mb-1 uppercase tracking-widest animate-pulse text-indigo-700 dark:text-indigo-300">WHO GOES THERE?!</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-xs font-mono">Analyzing face... wait, just password.</p>
                        </motion.div>
                    )}

                    {/* 🎉 STATE 3: SUCCESS */}
                    {status === 'success' && (
                        <motion.div key="success" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                                <div className="relative">
                                <motion.div variants={botVariants} animate="success">
                                    <Gift size={110} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
                                </motion.div>
                            </div>
                            <h2 className="text-3xl font-extrabold mt-6 mb-2 text-emerald-700 dark:text-emerald-400">Ayyy! You're IN! 🎉</h2>
                            <p className="text-emerald-600 dark:text-emerald-500 text-sm font-bold">Opening the gates...</p>
                        </motion.div>
                    )}

                    {/* 🚨 STATE 4: ERROR */}
                    {status === 'error' && (
                        <motion.div key="error" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                            <div className="relative">
                                <motion.div variants={botVariants} animate="error">
                                    <Cpu size={110} className="text-rose-500 opacity-80" />
                                </motion.div>
                                <div className="absolute -top-4 -right-4 text-rose-500 animate-pulse">
                                    <AlertTriangle size={50} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mt-6 mb-2 text-rose-600 dark:text-rose-500">NOPE. Don't know ya.</h2>
                            <p className="text-rose-500 dark:text-rose-400 text-xs">{serverError || "Wrong credentials."}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      </motion.div>
    </div>
  );
}