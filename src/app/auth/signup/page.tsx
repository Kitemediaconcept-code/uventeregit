'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please enter all fields');
      return;
    }
    
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created successfully! You are now logged in.');
      router.push(redirect);
      setTimeout(() => window.location.reload(), 500); 
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 relative bg-[#f8fafc]">
      <GlassCard padding="lg" className="w-full max-w-md mx-4 shadow-xl border-t-red-500/20 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600">Join us to craft your unforgettable events.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="input-glass pl-[44px]" 
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                className="input-glass pl-[44px]" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-6 py-3 text-white" isLoading={isLoading}>
            Sign Up
          </Button>

          <p className="text-center text-slate-500 text-sm mt-6">
             Already have an account? <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-red-500 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-slate-600">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
