'use client';
import Link from 'next/link';
import { Rocket, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    // 🔥 Background Change: bg-white -> bg-white dark:bg-slate-950
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* ব্র্যান্ড */}
            <div className="col-span-1 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-full transition-colors">
                        <Rocket size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold text-black dark:text-white transition-colors">
                        Hyper<span className="text-blue-600 dark:text-blue-400">Boost</span>
                    </span>
                </Link>
                <p className="text-gray-500 dark:text-slate-400 mb-6 transition-colors">
                    The #1 organic growth engine for creators who want real results, not fake numbers.
                </p>
                <div className="flex gap-4">
                    <SocialIcon Icon={Twitter} />
                    <SocialIcon Icon={Instagram} />
                    <SocialIcon Icon={Linkedin} />
                    <SocialIcon Icon={Github} />
                </div>
            </div>

            {/* লিংকস */}
            <div>
                <h4 className="font-bold text-black dark:text-white mb-6 transition-colors">Platform</h4>
                <ul className="space-y-4 text-gray-500 dark:text-slate-400 transition-colors">
                    <FooterLink href="#">How it Works</FooterLink>
                    <FooterLink href="#">Pricing</FooterLink>
                    <FooterLink href="#">Leaderboard</FooterLink>
                    <FooterLink href="#">Earn Points</FooterLink>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-black dark:text-white mb-6 transition-colors">Company</h4>
                <ul className="space-y-4 text-gray-500 dark:text-slate-400 transition-colors">
                    <FooterLink href="#">About Us</FooterLink>
                    <FooterLink href="#">Careers</FooterLink>
                    <FooterLink href="#">Blog</FooterLink>
                    <FooterLink href="#">Contact</FooterLink>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-black dark:text-white mb-6 transition-colors">Legal</h4>
                <ul className="space-y-4 text-gray-500 dark:text-slate-400 transition-colors">
                    <FooterLink href="#">Privacy Policy</FooterLink>
                    <FooterLink href="#">Terms of Service</FooterLink>
                    <FooterLink href="#">Cookie Policy</FooterLink>
                </ul>
            </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
            <p className="text-sm text-gray-400 dark:text-slate-500 transition-colors">© 2025 HyperBoost Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400 transition-colors">All Systems Operational</span>
            </div>
        </div>
      </div>
    </footer>
  );
}

// ছোট হেল্পার কম্পোনেন্ট
function SocialIcon({ Icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-600 dark:text-slate-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
            <Icon size={18} />
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {children}
            </Link>
        </li>
    );
}