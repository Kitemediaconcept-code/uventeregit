import Link from 'next/link';
import { Globe, Share2, Mail, ArrowUpRight, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 no-underline">
              <img 
                src="/logo.png" 
                alt="Uventere Logo" 
                className="h-10 w-auto object-contain"
                style={{ filter: 'hue-rotate(220deg)' }} 
              />
            </Link>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-[280px]">
              The premium event creation and discovery platform for the next generation of experiences. 
            </p>
            <div className="flex gap-4">
              {[Globe, Share2, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-8">Platform</h4>
            <div className="flex flex-col gap-4">
              {['Explore', 'Categories', 'Coordinators', 'Bespoke Requests'].map((link) => (
                <Link key={link} href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-[15px] no-underline flex items-center group">
                  {link} <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-8">Support</h4>
            <div className="flex flex-col gap-4">
              {['Contact Us', 'FAQ', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <Link key={link} href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-[15px] no-underline">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-8">Stay Updated</h4>
            <p className="text-slate-500 text-[14px] mb-6 leading-relaxed">
              Get updates on exclusive events straight to your inbox.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
              <button 
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                aria-label="Subscribe"
              >
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Uventere Platform. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Security</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Status</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer font-medium text-slate-900 border-l border-slate-200 pl-8">Build v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
