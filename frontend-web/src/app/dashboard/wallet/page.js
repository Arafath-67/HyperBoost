'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Crown, ShoppingBag, CreditCard, Smartphone, 
  Youtube, Facebook, Instagram, Video, Users, MonitorPlay, 
  Zap, Star, Check, ShieldCheck, CheckCircle2, Link as LinkIcon 
} from 'lucide-react';

// 🔥 API Import (Make sure this path is correct)
import api from '../../../services/api'; 

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); 
  const [currency] = useState('BDT'); 

  const rates = {
      USD: { rate: 1, symbol: '$' },
      BDT: { rate: 120, symbol: '৳' },
  };

  const getUSD = (bdtPrice) => bdtPrice / 120;

  const platforms = [
      { 
          id: 'youtube', 
          name: 'YouTube', 
          icon: Youtube, 
          color: 'text-red-600', 
          bg: 'bg-red-50', 
          ring: 'ring-red-500',
          services: [
              { id: 'yt_sub', name: 'Real Subscribers', priceUSD: getUSD(2.0), desc: 'Permanent organic growth' }, 
              { id: 'yt_view', name: 'Video Views', priceUSD: getUSD(0.20), desc: 'High retention views' }, 
          ]
      },
      { 
          id: 'facebook', 
          name: 'Facebook', 
          icon: Facebook, 
          color: 'text-blue-600', 
          bg: 'bg-blue-50', 
          ring: 'ring-blue-500',
          services: [
              { id: 'fb_follow', name: 'Page Followers', priceUSD: getUSD(1.50), desc: 'Real active profiles' }, 
              { id: 'fb_view', name: 'Video Views', priceUSD: getUSD(0.20), desc: 'Monetizable views' }, 
          ]
      },
      { 
          id: 'instagram', 
          name: 'Instagram', 
          icon: Instagram, 
          color: 'text-pink-600', 
          bg: 'bg-pink-50', 
          ring: 'ring-pink-500',
          services: [
              { id: 'ig_follow', name: 'Followers', priceUSD: getUSD(1.50), desc: 'Boost social proof' }, 
              { id: 'ig_view', name: 'Reel Views', priceUSD: getUSD(0.20), desc: 'Viral potential' }, 
          ]
      },
      { 
          id: 'tiktok', 
          name: 'TikTok', 
          icon: Video, 
          color: 'text-black', 
          bg: 'bg-gray-100', 
          ring: 'ring-gray-800',
          services: [
              { id: 'tt_follow', name: 'Followers', priceUSD: getUSD(1.50), desc: 'Fast delivery' }, 
              { id: 'tt_view', name: 'Video Views', priceUSD: getUSD(0.20), desc: 'Instant start' }, 
          ]
      }
  ];

  const plans = [
    {
        id: 1,
        name: "Starter",
        priceUSD: 0,
        dailyLimit: "15 Tasks / Day",
        multiplier: "1x Points",
        features: ["Standard Support", "Access to all jobs", "Ads Included"],
        icon: ShieldCheck,
        color: "bg-gray-100 dark:bg-gray-800 text-gray-500",
        active: true
    },
    {
        id: 2,
        name: "Silver VIP",
        priceUSD: getUSD(150), 
        dailyLimit: "40 Tasks / Day",
        multiplier: "1.2x Points",
        features: ["Priority Support", "Faster Campaign Approval", "No Ads"],
        icon: Star,
        color: "bg-white border-2 border-orange-400 ring-4 ring-orange-500/10",
        popular: true,
        active: false
    },
    {
        id: 3,
        name: "Gold Elite",
        priceUSD: getUSD(300), 
        dailyLimit: "70 Tasks / Day",
        multiplier: "2x Points",
        features: ["Dedicated Manager", "Golden Profile Badge", "Top Priority"],
        icon: Crown,
        color: "bg-slate-900 text-white dark:bg-indigo-900",
        active: false
    }
  ];

  const quantityOptions = [50, 100, 300, 500, 1000, 2500];

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [selectedService, setSelectedService] = useState(platforms[0].services[0]);
  
  const [quantity, setQuantity] = useState(50);
  const [targetLink, setTargetLink] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const [mobileGateway, setMobileGateway] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SMART VALIDATION ---
  const isQuantityValid = quantity >= 20;
  const isLinkValid = targetLink.length > 5;
  const isPaymentValid = paymentMethod === 'card' || (paymentMethod === 'mobile' && mobileGateway !== '');
  
  const isFormReady = isQuantityValid && isLinkValid && isPaymentValid;

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handlePlatformChange = (platform) => {
      setSelectedPlatform(platform);
      setSelectedService(platform.services[0]);
  };

  const getTotal = () => {
      if (!quantity) return 0;
      const totalUSD = quantity * selectedService.priceUSD;
      const converted = totalUSD * rates[currency].rate;
      return Math.round(converted).toLocaleString();
  };

  const getPlanPrice = (usd) => {
      if(usd === 0) return "FREE";
      return `${rates[currency].symbol} ${Math.round(usd * rates[currency].rate)}`;
  };

  const getButtonText = () => {
      if (isSubmitting) return 'Processing...';
      if (!isLinkValid) return 'Enter Link to Continue';
      if (!isPaymentValid) return 'Select Payment Method';
      return 'Pay & Launch Campaign';
  };

  // 🔥 UPDATED PURCHASE HANDLER (With API Call)
  const handlePurchase = async (e) => {
      e.preventDefault();
      if(!isFormReady) return;

      // ডেমো TrxID (ভবিষ্যতে এখানে ইউজার ইনপুট ফিল্ড বসাতে হবে)
      const fakeTrxId = `TRX-${Math.floor(Math.random() * 1000000)}`;

      setIsSubmitting(true);

      try {
          const payload = {
              category: 'service', // Currently only service buying logic is active here
              paymentMethod,
              mobileGateway,
              transactionId: fakeTrxId, 
              amount: parseFloat(getTotal().replace(/,/g, '')), // "1,200" -> 1200
              
              // Service Data
              platform: selectedPlatform.id,
              serviceId: selectedService.id,
              targetLink,
              quantity,

              // Membership Data
              planId: null 
          };

          // 🔥 আসল API কল
          const { data } = await api.post('/payment/deposit', payload);
          
          if(data.success) {
              alert(`✅ Success! Order ID: ${data.orderId}\nStatus: Pending Approval`);
              setTargetUrl(''); 
              setQuantity(50);
          }
          
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || "❌ Payment Failed! Try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-24 font-sans">
      
      {/* HEADER */}
      <div className="mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {activeTab === 'services' ? 'Boost Your Channel' : 'VIP Membership'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium">
              {activeTab === 'services' ? 'Select a package to start growing instantly.' : 'Upgrade your account to earn points faster.'}
          </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex relative w-full max-w-md shadow-inner">
              <button 
                onClick={() => setActiveTab('services')} 
                className={`relative z-10 flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'services' ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <ShoppingBag size={18}/> Buy Services
              </button>
              <button 
                onClick={() => setActiveTab('membership')} 
                className={`relative z-10 flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'membership' ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <Crown size={18}/> VIP Upgrade
              </button>
          </div>
      </div>

      <AnimatePresence mode='wait'>
          
          {/* TAB 1: BUY SERVICES */}
          {activeTab === 'services' && (
            <motion.div 
                key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
                {/* LEFT SIDE */}
                <div className="lg:col-span-7 space-y-10">
                    
                    {/* 1. PLATFORM */}
                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose Platform</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {platforms.map((p) => (
                                <div 
                                    key={p.id} 
                                    onClick={() => handlePlatformChange(p)}
                                    className={`group cursor-pointer flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                                        selectedPlatform.id === p.id 
                                        ? `border-transparent ring-4 ring-offset-2 dark:ring-offset-gray-900 ${p.ring} ${p.bg}` 
                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <p.icon size={32} className={`transition-transform group-hover:scale-110 ${p.color}`}/>
                                    <span className={`text-sm font-bold ${selectedPlatform.id === p.id ? 'text-gray-900' : 'text-gray-500'}`}>{p.name}</span>
                                    {selectedPlatform.id === p.id && <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm"><CheckCircle2 size={16} className={p.color}/></div>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. SERVICE */}
                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Service</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedPlatform.services.map((s) => (
                                <div 
                                    key={s.id} 
                                    onClick={() => setSelectedService(s)}
                                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                                        selectedService.id === s.id 
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-2 rounded-lg ${s.id.includes('sub') || s.id.includes('follow') ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {s.id.includes('sub') || s.id.includes('follow') ? <Users size={20}/> : <MonitorPlay size={20}/>}
                                        </div>
                                        {selectedService.id === s.id && <div className="bg-indigo-600 text-white p-1 rounded-full"><CheckCircle2 size={14}/></div>}
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{s.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. DETAILS */}
                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Details</h3>
                        </div>
                        <div className="space-y-8">
                            
                            {/* Quantity Buttons */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Select Quantity</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {quantityOptions.map((qty) => (
                                        <button
                                            key={qty}
                                            onClick={() => setQuantity(qty)}
                                            className={`py-4 rounded-xl text-lg font-bold transition-all border-2 ${
                                                quantity === qty
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 transform scale-[1.02]'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {qty}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Link Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{selectedPlatform.name} Link</label>
                                <div className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl px-5 py-2 transition-all ${targetLink.length > 5 ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <LinkIcon size={20} className="text-gray-400"/>
                                    <input 
                                        type="url" 
                                        value={targetLink}
                                        onChange={(e) => setTargetLink(e.target.value)}
                                        placeholder={`Paste your ${selectedPlatform.name} URL here...`}
                                        className="w-full py-4 bg-transparent outline-none font-medium text-lg text-gray-900 dark:text-white placeholder:text-gray-400"
                                    />
                                    {targetLink.length > 5 && <CheckCircle2 size={24} className="text-emerald-500"/>}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDE: CHECKOUT */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-6">
                        
                        {/* 4. RECEIPT & PAYMENT */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            
                            {/* HEADER */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">4</div>
                                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Final Checkout</h3>
                            </div>

                            {/* SUMMARY */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mb-8">
                                <div className="space-y-4">
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-gray-500 font-medium">Platform</span>
                                         <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
                                            <selectedPlatform.icon size={16}/> {selectedPlatform.name}
                                         </div>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-gray-500 font-medium">Service</span>
                                         <span className="font-bold text-gray-800 dark:text-white">{selectedService.name}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                         <span className="text-gray-500 font-medium">Quantity</span>
                                         <span className="font-bold text-gray-800 dark:text-white">{quantity} Units</span>
                                     </div>
                                     <div className="flex justify-between items-end pt-4">
                                         <span className="font-bold text-indigo-600">Total Price</span>
                                         <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                             <span className="text-2xl align-top opacity-50 mr-1">{rates[currency].symbol}</span>
                                             {getTotal()}
                                         </span>
                                     </div>
                                 </div>
                            </div>

                            {/* PAYMENT METHOD SELECTOR */}
                            <div className="space-y-3 mb-8">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Select Payment Method</p>
                                
                                {/* Card */}
                                <label 
                                    onClick={() => { if(isFormReady) { setPaymentMethod('card'); setMobileGateway(''); }}}
                                    className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                        paymentMethod === 'card' 
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className={paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'}/>
                                        <span className={`font-bold ${paymentMethod === 'card' ? 'text-indigo-900 dark:text-white' : 'text-gray-500'}`}>Credit / Debit Card</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                                    </div>
                                </label>

                                {/* Mobile */}
                                <div 
                                    onClick={() => { if(isFormReady) setPaymentMethod('mobile') }}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                        paymentMethod === 'mobile' 
                                        ? 'border-indigo-600 bg-white dark:bg-gray-800' 
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Smartphone size={20} className={paymentMethod === 'mobile' ? 'text-indigo-600' : 'text-gray-400'}/>
                                            <span className={`font-bold ${paymentMethod === 'mobile' ? 'text-indigo-900 dark:text-white' : 'text-gray-500'}`}>Mobile Banking</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mobile' ? 'border-indigo-600' : 'border-gray-300'}`}>
                                            {paymentMethod === 'mobile' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                                        </div>
                                    </div>
                                    {paymentMethod === 'mobile' && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 grid grid-cols-3 gap-2">
                                            {['bkash', 'nagad', 'rocket'].map((gw) => (
                                                <div 
                                                    key={gw} 
                                                    onClick={(e) => { e.stopPropagation(); setMobileGateway(gw); }} 
                                                    className={`py-2 rounded-lg text-center text-xs font-bold uppercase border cursor-pointer ${
                                                        mobileGateway === gw ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                                                    }`}
                                                >
                                                    {gw}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* PAY BUTTON */}
                            <button 
                                onClick={handlePurchase}
                                disabled={!isFormReady || isSubmitting}
                                className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-2 shadow-xl transition-all ${
                                    isFormReady
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-1 cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                                }`}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Zap size={24} fill="currentColor"/>}
                                {getButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

          {/* TAB 2: MEMBERSHIP UPGRADE */}
          {activeTab === 'membership' && (
            <motion.div 
                key="membership" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {plans.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`relative rounded-[2rem] p-8 border-2 flex flex-col h-full hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 ${plan.color.includes('border') ? plan.color : 'border-gray-100 dark:border-gray-800'}`}
                    >
                        {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">Best Value</div>}
                        
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${plan.id === 3 ? 'bg-slate-800 text-white' : plan.id === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                            <plan.icon size={32}/>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{getPlanPrice(plan.priceUSD)}</span>
                            {plan.priceUSD !== 0 && <span className="text-sm text-gray-500 font-bold">/month</span>}
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                                <Zap size={18} className="text-indigo-500 shrink-0"/> {plan.dailyLimit}
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                                <Star size={18} className="text-indigo-500 shrink-0"/> {plan.multiplier}
                            </li>
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                                    <Check size={18} className="text-emerald-500 shrink-0"/> {feat}
                                </li>
                            ))}
                        </ul>

                        <button 
                            disabled={plan.active}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                                plan.active 
                                ? 'bg-gray-100 text-gray-400 cursor-default shadow-none' 
                                : plan.popular 
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105' 
                                    : plan.id === 3 
                                        ? 'bg-slate-900 text-white hover:bg-black' 
                                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {plan.active ? "Current Plan" : "Upgrade Now"}
                        </button>
                    </div>
                ))}
            </motion.div>
          )}

      </AnimatePresence>
    </div>
  );
}