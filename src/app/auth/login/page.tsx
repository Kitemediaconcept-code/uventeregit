'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Mail, User, Lock, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('uventere_user')) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user logic
      const user = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
      };
      
      localStorage.setItem('uventere_user', JSON.stringify(user));
      toast.success('Logged in successfully!');
      router.push(redirect);
      // Wait for router push
      setTimeout(() => window.location.reload(), 500); 
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 relative">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
         <div className="orb orb-purple w-[500px] h-[500px] top-[10%] left-[20%]" />
      </div>

      <GlassCard padding="lg" className="w-full max-w-md mx-4 drop-shadow-2xl border-t-purple-500/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to book and manage events.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                className="input-glass pl-[44px]" 
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                className="input-glass pl-[44px]" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4 py-3" isLoading={isLoading}>
            Sign In
          </Button>

          <p className="text-center text-slate-400 text-sm mt-6">
             Don't have an account? <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-purple-400 font-medium hover:text-purple-300">Sign up free</Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
