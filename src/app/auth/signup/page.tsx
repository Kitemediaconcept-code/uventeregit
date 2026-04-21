'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
      options: { data: { full_name: name } }
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created successfully!');
      router.push(redirect);
      setTimeout(() => window.location.reload(), 500); 
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 relative bg-zinc-50">
      <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-[32px] p-10 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black mb-3 tracking-tighter">Create Account</h1>
          <p className="text-gray-500">Join us to craft your unforgettable events.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                className="w-full h-14 pl-12 rounded-xl bg-zinc-50 border border-gray-200 outline-none focus:border-[#07715F] transition-colors text-black text-sm" 
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
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

          <Button type="submit" variant="primary" className="w-full py-4 text-base mt-2" isLoading={isLoading}>
            Sign Up Free
          </Button>

          <p className="text-center text-gray-500 text-sm mt-6 pb-2">
            Already have an account?{' '}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-[#07715F] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-black">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
