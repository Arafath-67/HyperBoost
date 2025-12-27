'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Icons
import { User, Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff, Cpu, ShieldAlert, ShieldCheck, Zap, Gift, Loader2, XCircle, ScanLine } from 'lucide-react';
import api from '../../../services/api'; 

export default function RegisterPage() {
  const router = useRouter();
  
  // Form States
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Logic States
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0); 
  const [status, setStatus] = useState('idle'); 
  const [serverError, setServerError] = useState('');

  // 🛡️ SECURITY
  const sanitizeInput = (text) => {
    let cleanText = text.replace(/<[^>]*>?/gm, ''); 
    cleanText = cleanText.replace(/['";\\]/g, '');   
    return cleanText;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Invalid email address.";
    const domain = email.split('@')[1];
    if (domain && domain.indexOf('.') === -1) return "Invalid email domain.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = sanitizeInput(value);
    setFormData({ ...formData, [name]: cleanValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handlePasswordChange = (e) => {
    const pass = sanitizeInput(e.target.value);
    setPassword(pass);
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-slate-300 dark:bg-slate-700";
    if (strength <= 2) return "bg-rose-500";
    if (strength === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const newErrors = {};
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    if (formData.username.length < 3) newErrors.username = "Username too short.";
    if (password.length < 6) newErrors.password = "Password too short.";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setStatus('loading');

    try {
        await new Promise(r => setTimeout(r, 2500)); 

        const payload = {
            username: formData.username,
            email: formData.email,
            password: password,
            deviceFingerprint: `SECURE-ID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        const response = await api.post('/auth/register', payload);

        if(response.data.success) {
            setStatus('success');
            setTimeout(() => router.push('/auth/login'), 2500);
        }

    } catch (err) {
        setStatus('error');
        setServerError(err.response?.data?.message || "Registration Failed.");
        setTimeout(() => setStatus('idle'), 3500);
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } }
  };

  // 🔥 RESTORED: আসল রঙিন গ্রেডিয়েন্ট (Day Mode এর জন্য)
  const getDayGradient = () => {
      if (status === 'success') return 'from-emerald-500/30 via-green-400/20 to-teal-300/10';
      if (status === 'error') return 'from-rose-500/30 via-red-400/20 to-orange-300/10';
      if (status === 'loading') return 'from-indigo-500/30 via-purple-400/20 to-blue-300/10';
      // Idle
      if (!password) return 'from-slate-400/20 via-gray-300/10 to-transparent'; 
      if (strength <= 2) return 'from-rose-500/30 via-orange-400/20 to-yellow-300/10';
      if (strength === 3) return 'from-amber-500/30 via-yellow-400/20 to-orange-300/10';
      return 'from-emerald-500/30 via-teal-400/20 to-green-300/10';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-24 md:pt-32 font-sans relative overflow-hidden transition-colors duration-500 bg-[#F8FAFC] dark:bg-black">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 transition-all duration-500 shadow-2xl bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-900 shadow-slate-200/50 dark:shadow-none"
      >
        
        {/* === LEFT: FORM (Unchanged) === */}
        <div className="p-8 md:p-12 relative z-20 flex flex-col justify-center bg-white dark:bg-[#050505] transition-colors duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900 dark:text-white">
                    Create Account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Start your secure journey today.</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors font-bold text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Chrome size={18} /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors font-bold text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Github size={18} /> GitHub
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white dark:bg-[#050505] text-slate-400 dark:text-slate-500">Or register with email</span></div>
            </div>

            <AnimatePresence>
                {serverError && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 p-3 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-lg border border-rose-500/20 text-center flex items-center justify-center gap-2">
                        <XCircle size={16}/> {serverError}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-5">
                {/* Username */}
                <div className="space-y-1">
                    <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Username</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" size={18} />
                        <input name="username" onChange={handleChange} type="text" placeholder="John Doe" value={formData.username}
                            className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.username ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`} />
                    </div>
                    {errors.username && <p className="text-[10px] text-rose-500 ml-1">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" size={18} />
                        <input name="email" onChange={handleChange} type="email" placeholder="you@example.com" value={formData.email}
                            className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`} />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 ml-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 uppercase text-slate-600 dark:text-slate-400">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" size={18} />
                        <input type={showPassword ? "text" : "password"} placeholder="Strong passphrase..." value={password} onChange={handlePasswordChange}
                            className={`w-full pl-11 pr-11 py-3.5 border rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    {password.length > 0 && (
                        <div className="flex gap-1 h-1 px-1 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${strength >= i ? getStrengthColor() : "bg-slate-200 dark:bg-slate-800"}`} />
                            ))}
                        </div>
                    )}
                     {errors.password && <p className="text-[10px] text-rose-500 ml-1">{errors.password}</p>}
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group border
                        ${status === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
                          'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:scale-[1.01]'}`}
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : status === 'success' ? "Success!" : <>Sign Up <ArrowRight size={18} /></>}
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-xs text-slate-500">
                 Already have an account? <Link href="/auth/login" className="font-bold hover:underline text-indigo-600 dark:text-indigo-400">Login here</Link>
            </p>
        </div>

        {/* === RIGHT: BEAUTIFUL DYNAMIC BACKGROUND === */}
        {/* 🔥 FIX: 'dark:bg-black' - কুচকুচে কালো ব্যাকগ্রাউন্ড */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-slate-50 dark:bg-black">
            
            {/* 🌞 DAY MODE: Colorful Rotating Aurora (Restored) */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br opacity-40 blur-[100px] transition-colors duration-1000 dark:hidden ${getDayGradient()}`}
            />

            {/* 🌙 NIGHT MODE: "GHARO" (Deep Dark) Effect */}
            {/* একটি বড় কালো ওভারলে এবং তার নিচে হালকা ডিপ গ্লো */}
            <div className="absolute inset-0 bg-black hidden dark:block"></div>
            
            {/* 🔥 Deep Central Glow (পরিবর্তিত) */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900 rounded-full blur-[120px] hidden dark:block"
            />
            {/* 🔥 Subtle Accent Glow (পরিবর্তিত) */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-full blur-[80px] hidden dark:block"
            />
            
            <div className="relative z-10 text-center w-full max-w-xs">
                <AnimatePresence mode="wait">
                    
                    {/* Status Wrapper */}
                    <motion.div 
                        key={status + strength}
                        variants={iconVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="flex flex-col items-center"
                    >
                        {/* 🛡️ SCANNING RING */}
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                            
                            {(status === 'loading' || (password && strength < 4)) && (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-full"
                                />
                            )}

                            <motion.div 
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm z-20"
                            />

                            {/* --- ICONS --- */}
                            {status === 'success' && <Gift size={80} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />}
                            {status === 'loading' && <Cpu size={80} className="text-indigo-500 animate-pulse" />}
                            {status === 'error' && <ShieldAlert size={80} className="text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />}
                            
                            {/* Password States */}
                            {status === 'idle' && !password && <ScanLine size={80} className="text-slate-400 dark:text-slate-700" />}
                            {status === 'idle' && password && strength <= 2 && <ShieldAlert size={80} className="text-rose-500" />}
                            {status === 'idle' && password && strength === 3 && <Zap size={80} className="text-amber-500" />}
                            {status === 'idle' && password && strength === 4 && <ShieldCheck size={80} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />}

                        </div>

                        {/* --- TEXT --- */}
                        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300
                            ${status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 
                              status === 'error' ? 'text-rose-600 dark:text-rose-400' : 
                              'text-slate-800 dark:text-white'}`}>
                            {status === 'success' && "Account Created!"}
                            {status === 'loading' && "Encrypting Data..."}
                            {status === 'error' && "Security Alert"}
                            {status === 'idle' && !password && "System Ready"}
                            {status === 'idle' && password && strength <= 2 && "Weak Signal"}
                            {status === 'idle' && password && strength === 3 && "Optimizing..."}
                            {status === 'idle' && password && strength === 4 && "Secure Connection"}
                        </h2>
                        
                        <p className="text-slate-500 dark:text-slate-500 text-sm font-mono tracking-wide">
                            {status === 'success' && "Redirecting to login..."}
                            {status === 'loading' && "Establishing secure handshake..."}
                            {status === 'error' && "Please verify your input."}
                            {status === 'idle' && !password && "Awaiting credentials input."}
                            {status === 'idle' && password && strength <= 2 && "Password complexity too low."}
                            {status === 'idle' && password && strength === 3 && "Adding encryption layers."}
                            {status === 'idle' && password && strength === 4 && "Maximum security enabled."}
                        </p>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

      </motion.div>
    </div>
  );
}