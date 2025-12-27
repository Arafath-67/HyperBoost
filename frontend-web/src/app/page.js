// Footer বা Navbar ইম্পোর্ট করার দরকার নেই (layout.js হ্যান্ডেল করবে)
import Hero from '../components/Hero'; 
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent relative">
      
      {/* ১. হিরো সেকশন */}
      <Hero /> 

      {/* ২. স্ট্যাটস কার্ড */}
      <Stats />

      <HowItWorks />

      {/* ৩. ফিচারস */}
      <Features />
      
      {/* ৪. কল টু অ্যাকশন */}
      <CTA />
      
      {/* Footer এখানে থাকবে না, কারণ সেটা layout.js-এ আছে */}
    </main>
  );
}