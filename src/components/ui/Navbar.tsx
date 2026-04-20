'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Calendar, ChevronDown, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';

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

  // Mock auth state — replace with Supabase session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('uventere_user');
    if (stored) {
      const user = JSON.parse(stored);
      setIsLoggedIn(true);
      setUserName(user.name || 'User');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('uventere_user');
    setIsLoggedIn(false);
    setUserName('');
    setUserMenuOpen(false);
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
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          background: scrolled
            ? 'rgba(6,6,15,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          padding: scrolled ? '12px 0' : '20px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>
              <Calendar size={20} color="white" />
            </div>
            <span style={{
              fontSize: 22, fontWeight: 700,
              background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Uventere
            </span>
          </Link>

          {/* ── Center Nav Links (desktop) ── */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                style={{ padding: '8px 16px', borderRadius: 12, display: 'block' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-secondary)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)';
                (e.currentTarget as HTMLElement).style.color = '#a78bfa';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
              }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Auth / User */}
            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 40, padding: '8px 16px 8px 8px',
                    cursor: 'pointer', color: '#a78bfa',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'white',
                  }}>
                    {userName[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{userName.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {userMenuOpen && (
                  <div className="glass" style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    minWidth: 200, padding: '8px', borderRadius: 20, zIndex: 1000,
                  }}>
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard'          },
                      { icon: Calendar,        label: 'My Bookings',   href: '/dashboard/bookings' },
                      { icon: Heart,           label: 'Saved Events',  href: '/dashboard/saved'    },
                      { icon: User,            label: 'Profile',       href: '/dashboard/profile'  },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', borderRadius: 14,
                          color: 'var(--color-text-secondary)', textDecoration: 'none',
                          fontSize: 14, fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)';
                          (e.currentTarget as HTMLElement).style.color = '#a78bfa';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))}
                    <div className="divider" style={{ margin: '8px 0' }} />
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 14,
                        color: '#f87171', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 14, fontWeight: 500,
                        width: '100%', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link href="/auth/login" className="btn-glass" style={{ padding: '10px 20px', fontSize: 14 }}>
                  Login
                </Link>
                <Link href="/events" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                  Book an Event
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                width: 40, height: 40,
                display: 'none', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-primary)',
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 997,
          background: 'rgba(6,6,15,0.97)',
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
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
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
                color: pathname === link.href ? '#a78bfa' : 'var(--color-text-primary)',
                textDecoration: 'none', borderRadius: 20,
                transition: 'all 0.2s',
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; }}
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
            background: 'rgba(6,6,15,0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 120,
          }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="glass" style={{ width: '100%', maxWidth: 600, margin: '0 24px', padding: '8px', borderRadius: 40 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px' }}>
              <Search size={20} color="var(--color-text-muted)" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events, venues, cities..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'white', fontSize: 18, fontFamily: 'var(--font-sf)',
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
