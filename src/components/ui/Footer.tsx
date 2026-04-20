import Link from 'next/link';
import { Calendar, Camera, MessageCircle, Briefcase, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      paddingTop: '80px',
      paddingBottom: '40px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand Info */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '20px' }}>
              <img 
                src="/logo.png" 
                alt="Uventere Logo" 
                style={{ height: 42, width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '280px' }}>
              Premium event coordination and booking platform. Turn your vision into unforgettable experiences.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.3s' }} className="hover:text-primary-light">
                <Camera size={20} />
              </a>
              <a href="#" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.3s' }} className="hover:text-primary-light">
                <MessageCircle size={20} />
              </a>
              <a href="#" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.3s' }} className="hover:text-primary-light">
                <Briefcase size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '16px', marginBottom: '24px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/events" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Events View</Link>
              <Link href="/categories" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Categories</Link>
              <Link href="/coordinators" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Find Coordinators</Link>
              <Link href="/custom-event" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Request Custom Event</Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '16px', marginBottom: '24px' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/contact" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Contact Us</Link>
              <Link href="/faq" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">FAQ</Link>
              <Link href="/terms" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Terms of Service</Link>
              <Link href="/privacy" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '15px' }} className="hover:text-white">Privacy Policy</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '16px', marginBottom: '24px' }}>Newsletter</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Get updates on premium events straight to your inbox.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="input-glass" 
                style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '12px' }} 
              />
              <button 
                className="btn-primary" 
                style={{ padding: '10px 16px', borderRadius: '12px', flexShrink: 0 }}
                aria-label="Subscribe"
              >
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: '24px' }} />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            © {new Date().getFullYear()} Uventere. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            <span>Made with ✨ and UI magic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
