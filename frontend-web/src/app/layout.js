import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IntroLoader from '../components/IntroLoader'; // 🔥 আপনার লোডার
import { ThemeProvider } from '../providers/ThemeProvider'; // 🔥 ডার্ক মোড প্রোভাইডার
import AdBlockTrap from '../components/AdBlockTrap'; // 🔥 ১. নতুন: ফাঁদ ইম্পোর্ট করা হলো

export const metadata = {
  title: 'HyperBoost',
  description: 'Organic Growth Engine',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning দেওয়া হয়েছে যাতে থিম লোড নিয়ে এরর না দেয়
    <html lang="en" suppressHydrationWarning>
      
      {/* বডি ব্যাকগ্রাউন্ড: লাইট মোডে সাদা, ডার্ক মোডে গাঢ় নীল */}
      <body className="bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
        
        {/* ১. থিম প্রোভাইডার দিয়ে সব মুড়িয়ে দেওয়া হলো */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* 🔥 ২. অ্যাডব্লকার ফাঁদ (সবার আগে চেক করবে) 🔥 */}
          <AdBlockTrap />

          {/* ৩. ইন্ট্রো লোডার */}
          <IntroLoader />

          {/* ৪. মেইন ওয়েবসাইট */}
          <Navbar />
          {children}
          <Footer />

        </ThemeProvider>

      </body>
    </html>
  );
}