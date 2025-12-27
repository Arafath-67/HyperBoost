'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Edit3, Save, X, Loader2, Copy, Check, 
  Camera, MapPin, Globe, ShieldCheck, Activity, UploadCloud 
} from 'lucide-react';
import api from '../../../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // ইমেজ প্রিভিউ স্টেট
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // এডিট ফর্ম ডাটা
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: 'Digital Creator & Earner', 
    location: 'Bangladesh'
  });

  // ১. ডাটা লোড করা
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
            setUser(data.user);
            setFormData({ 
                username: data.user.username, 
                email: data.user.email,
                bio: data.user.bio || 'Digital Creator & Earner',
                location: data.user.location || 'Bangladesh'
            });
        }
    } catch (error) {
        console.error("Failed to load profile", error);
    } finally {
        setLoading(false);
    }
  };

  // ২. প্রোফাইল আপডেট
  const handleUpdate = async () => {
      try {
          const { data } = await api.put('/auth/updatedetails', formData);
          if(data.success) {
              setUser(data.user);
              setIsEditing(false);
              alert('Profile Updated Successfully! ✨');
          }
      } catch (error) {
          alert('Update Failed. Please try again.');
      }
  };

  // ৩. ছবি সিলেক্ট হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      // এখানে ভবিষ্যতে ছবি আপলোডের API কল হবে
    }
  };

  // রেফারেল কপি
  const handleCopy = () => {
      if(user?.referralCode) {
          navigator.clipboard.writeText(`https://hyperboost.com/register?ref=${user.referralCode}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  }

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* --- HEADER SECTION (Clean Style) --- */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar Section */}
          <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-inner flex items-center justify-center overflow-hidden relative">
                  {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-extrabold text-white">
                          {user?.username?.substring(0, 2).toUpperCase()}
                      </div>
                  )}
                  
                  {/* Camera Overlay */}
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                  >
                      <Camera className="text-white mb-1" size={24} />
                      <span className="text-white text-[10px] font-bold uppercase">Change</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*"
                  />
              </div>

              {/* Active Status Dot */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full z-10" title="Active">
                   <span className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></span>
              </div>
          </div>

          {/* Name & Bio */}
          <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user?.username}
                  </h1>
                  {user?.isPremium && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
                          <ShieldCheck size={14}/> Premium
                      </span>
                  )}
              </div>
              
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Now • {formData.bio}
              </p>

              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {formData.location}</span>
                  <span className="flex items-center gap-1"><Globe size={14}/> English</span>
              </div>
          </div>

          {/* Edit Button */}
          <div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${isEditing ? 'bg-red-50 text-red-600' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-lg'}`}
              >
                  {isEditing ? <><X size={18}/> Cancel Edit</> : <><Edit3 size={18}/> Edit Profile</>}
              </button>
          </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Stats Card */}
          <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Earnings & Trust</h3>
                  
                  <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                          <div>
                              <p className="text-xs text-slate-500">Balance</p>
                              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400">{user?.points}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-white/10 rounded-lg text-indigo-600">
                              <Activity size={20}/>
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <div>
                              <p className="text-xs text-slate-500">Reputation</p>
                              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">100%</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-white/10 rounded-lg text-emerald-600">
                              <ShieldCheck size={20}/>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Referral Box (Small) */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                      <UploadCloud size={20} className="text-indigo-400"/>
                      <h4 className="font-bold">Referral Link</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Earn 500 points for every friend.</p>
                  
                  <div className="bg-white/10 p-2 rounded-lg flex items-center gap-2 border border-white/10">
                      <code className="text-xs flex-1 truncate font-mono text-slate-300">
                         hypr.com/{user?.referralCode}
                      </code>
                      <button onClick={handleCopy} className="text-indigo-400 hover:text-white transition-colors">
                          {copied ? <Check size={16}/> : <Copy size={16}/>}
                      </button>
                  </div>
              </div>
          </div>

          {/* Right: Details Form */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                      {isEditing ? (
                          <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 transition-all"/>
                      ) : (
                          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300">
                              <User size={20} className="text-slate-400"/> {user?.username}
                          </div>
                      )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      {isEditing ? (
                          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 transition-all"/>
                      ) : (
                          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300">
                              <Mail size={20} className="text-slate-400"/> {user?.email}
                          </div>
                      )}
                  </div>

                  {/* Bio & Location Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                          {isEditing ? (
                              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 transition-all"/>
                          ) : (
                              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300">
                                  <MapPin size={20} className="text-slate-400"/> {formData.location}
                              </div>
                          )}
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Profile Bio</label>
                          {isEditing ? (
                              <input type="text" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 transition-all"/>
                          ) : (
                              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300">
                                  <Globe size={20} className="text-slate-400"/> {formData.bio}
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                  <div className="mt-8 flex justify-end animate-fade-in pt-6 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={handleUpdate}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                          <Save size={20} /> Save Changes
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}