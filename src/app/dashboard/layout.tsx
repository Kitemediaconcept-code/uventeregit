'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassCard';
import { LayoutDashboard, Calendar, Heart, User, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('uventere_user');
    if (!userStr) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  if (!user) return null;

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  ];

  return (
    <div className="container py-12 min-h-[85vh] flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-[280px] shrink-0">
        <GlassPanel className="p-6 sticky top-28 rounded-3xl">
          {/* User Profile Summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {user.name[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-white font-bold truncate max-w-[160px]">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate max-w-[160px]">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-red-500/20 text-white border border-red-500/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <link.icon size={18} className={isActive ? 'text-red-400' : ''} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <button 
              onClick={() => {
                localStorage.removeItem('uventere_user');
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 w-full transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </GlassPanel>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
