'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push(redirect);
      }
    };
    checkUser();
  }, [router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      router.push(redirect);
      setTimeout(() => window.location.reload(), 500); 
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 relative bg-zinc-50">
      <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-[32px] p-10 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black mb-3 tracking-tighter">Welcome Back</h1>
          <p className="text-gray-500">Sign in to book and manage events.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                className="w-full h-14 pl-12 rounded-xl bg-zinc-50 border border-gray-200 outline-none focus:border-[#07715F] transition-colors text-black text-sm" 
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-xs font-bold text-[#07715F] hover:text-[#065b4c] uppercase tracking-widest">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                className="w-full h-14 pl-12 rounded-xl bg-zinc-50 border border-gray-200 outline-none focus:border-[#07715F] transition-colors text-black text-sm" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-base mt-4" isLoading={isLoading}>
            Sign In
          </Button>

          <p className="text-center text-gray-500 text-sm mt-6 pb-2">
            Don't have an account?{' '}
            <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-[#07715F] font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-black">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
