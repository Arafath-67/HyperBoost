import axios from 'axios';
import { toast } from 'react-hot-toast'; // টোস্ট মেসেজ দেখানোর জন্য ইমপোর্ট

// আপনার ব্যাকএন্ড সার্ভারের ঠিকানা
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ১. রিকোয়েস্ট ইন্টারসেপ্টর (আপনার আগের কোড)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🔥🔥 ২. রেসপন্স ইন্টারসেপ্টর (নতুন যোগ করা হয়েছে) 🔥🔥
api.interceptors.response.use(
    (response) => response, // সফল হলে যা আছে তাই থাকবে
    (error) => {
        // যদি ব্যাকএন্ড বলে "ACCOUNT_BANNED" (403 Error)
        if (error.response && error.response.status === 403 && error.response.data.message === 'ACCOUNT_BANNED') {
            
            // ১. ব্রাউজার থেকে টোকেন মুছে ফেলো
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                
                // ২. ইউজারকে জানাও
                toast.error("Account Suspended! Logging out... 🚫");

                // ৩. জোর করে লগইন পেজে পাঠাও (১.৫ সেকেন্ড পর যাতে মেসেজটা দেখা যায়)
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            }
        }
        return Promise.reject(error);
    }
);

export default api;