'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    <div className="container py-12 min-h-[85vh] flex flex-col md:flex-row gap-8 bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-[280px] shrink-0">
        <div className="p-8 sticky top-28 rounded-[32px] bg-zinc-50 border border-gray-200 shadow-sm">
          {/* User Profile Summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-14 h-14 rounded-full bg-[#07715F] flex items-center justify-center text-xl font-bold text-white shadow-sm">
              {user.name[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-black font-bold truncate max-w-[160px]">{user.name}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[160px]">{user.email}</p>
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
                      ? 'bg-[#07715F]/10 text-[#07715F] border border-[#07715F]/20 font-bold' 
                      : 'text-gray-500 hover:bg-white hover:text-black border border-transparent font-medium'
                  }`}
                >
                  <link.icon size={18} className={isActive ? 'text-[#07715F]' : ''} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button 
              onClick={() => {
                localStorage.removeItem('uventere_user');
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 w-full transition-colors font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full text-black">
        {children}
      </div>
    </div>
  );
}
