'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Calendar, ChevronDown, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  { label: 'Explore',      href: '/events'       },
  { label: 'Categories',   href: '/categories'   },
  { label: 'Coordinators', href: '/coordinators' },
  { label: 'About',        href: '/about'        },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
      }
    };
    
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName('');
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchQuery.trim())}`;
    }
    setSearchOpen(false);
  };

  return (
    <>
      {/* ── Main Navbar ── */}
      <header 
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-full px-6 flex justify-center`}
        style={{
          marginTop: scrolled ? '16px' : '0px',
          width: scrolled ? 'min(1400px, 95%)' : '100%',
        }}
      >
        <div 
          className={`w-full transition-all duration-500 rounded-full ${scrolled ? 'glass shadow-2xl bg-white/70' : 'bg-transparent'}`}
          style={{
            padding: scrolled ? '12px 32px' : '24px 0',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
          }}
        >
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* ── Logo ── */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img 
                src="/logo.png" 
                alt="Uventere Logo" 
                style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'hue-rotate(220deg)' }} 
              />
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-800 hover:text-indigo-600 transition-colors" onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </button>
              
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Coordinator</span>
                    <span className="text-sm font-medium text-slate-800">{userName}</span>
                  </div>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-10 h-10 rounded-full border border-indigo-100 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <User size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="text-sm font-semibold text-slate-800 px-5 py-2 hover:text-indigo-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/custom-event" className="btn-primary !px-5 !py-2.5 !text-sm !font-bold !rounded-full shadow-lg shadow-indigo-200">
                    Book an Event
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 997,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 24px 0' }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 12, width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-primary)',
            }}
          >
            <X size={22} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', gap: 8 }}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block', padding: '18px 20px',
                fontSize: 28, fontWeight: 700,
                color: pathname === link.href ? 'var(--color-primary)' : 'var(--color-text-primary)',
                textDecoration: 'none', borderRadius: 20,
                transition: 'all 0.2s',
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,49,49,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary" style={{ textAlign: 'center' }}>
              My Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-glass" style={{ textAlign: 'center' }}>
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary" style={{ textAlign: 'center' }}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1001,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 120,
          }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: 600, margin: '0 24px', padding: '8px', borderRadius: 40 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px' }}>
              <Search size={20} color="var(--color-text-muted)" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events, venues, cities..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--color-text-primary)', fontSize: 18, fontFamily: 'var(--font-sf)',
                }}
              />
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
