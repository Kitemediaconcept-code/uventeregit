'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { User, Text, FileText, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BookEventRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    event_name: '',
    booking_person_details: '',
    description: '',
    pricing_details: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Fetch logged in user and pre-fill form
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({ 
          ...prev, 
          full_name: session.user.user_metadata?.full_name || '',
          booking_person_details: session.user.email || ''
        }));
      }
    };
    fetchUser();
  }, []);

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleMediaUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${user?.id || 'guest'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('event-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Upload media if exists
      let media_url = '';
      if (mediaFile) {
        media_url = await handleMediaUpload(mediaFile);
      }

      // 2. Insert record into database
      const { error } = await supabase
        .from('event-requests') // Map to correct sql table if named differently. We named it event_requests in SQL.
        .insert({
          user_id: user ? user.id : null,
          full_name: formData.full_name,
          event_name: formData.event_name,
          booking_person_details: formData.booking_person_details,
          description: formData.description,
          pricing_details: formData.pricing_details,
          media_url: media_url,
          status: 'pending'
        });

      if (error) {
        // Fallback for underscore mismatch just in case
        const retry = await supabase.from('event_requests').insert({...formData, user_id: user?.id || null, media_url, status: 'pending'});
        if (retry.error) throw retry.error;
      }

      setIsSuccess(true);
      toast.success('Event request sent successfully for coordinator review!');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 5000);

    } catch (err: any) {
      toast.error(err.message || 'Failed to submit event request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container py-20 min-h-[80vh] flex items-center justify-center bg-[#f8fafc]">
        <GlassCard padding="lg" className="max-w-xl text-center border-t-green-500 shadow-xl bg-white">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Sent Successfully!</h2>
          <p className="text-slate-600 text-lg mb-8">
            Thank you, {formData.full_name}. Our elite coordination team has received your request and will contact you shortly. Once approved, it will be published to the frontend platform!
          </p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">Go to Dashboard</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-screen relative bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto mb-10 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-50 text-red-500 text-sm font-medium w-fit mb-6">
          <Sparkles size={16} /> Client Booking Form
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Book an <span className="text-red-500">Event</span></h1>
        <p className="text-lg text-slate-600">Submit your event details below. Our internal team will review, approve, and publish it.</p>
        
        {!user && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600 inline-block w-full max-w-md">
            You are not logged in. <Link href="/auth/login?redirect=/custom-event" className="font-bold underline">Login</Link> to track your event status globally.
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-20">
        <GlassCard padding="lg" className="border-t-red-500/30 shadow-2xl bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" className="input-glass pl-11" required placeholder="John Doe" value={formData.full_name} onChange={e => updateForm('full_name', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                <div className="relative">
                  <Text className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" className="input-glass pl-11" required placeholder="E.g. Nexus Tech Summit" value={formData.event_name} onChange={e => updateForm('event_name', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Booking Person Details (Contact / Organization)</label>
              <input type="text" className="input-glass" required placeholder="Phone, Email, or Company Name" value={formData.booking_person_details} onChange={e => updateForm('booking_person_details', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pricing Details</label>
              <input type="text" className="input-glass" required placeholder="Provide your budget limitations or expected pricing..." value={formData.pricing_details} onChange={e => updateForm('pricing_details', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Event Description / Inputs</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea 
                  rows={5}
                  className="input-glass pl-11 py-4 leading-relaxed resize-none" 
                  required
                  placeholder="Tell us everything about the event you want to host..."
                  value={formData.description}
                  onChange={e => updateForm('description', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Event Media (Logo or Poster)</label>
              <div className="relative flex items-center p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <ImageIcon className="text-slate-400 ml-2" size={24} />
                <input 
                  type="file" 
                  accept="image/*"
                  className="ml-4 w-full text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setMediaFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Button type="submit" variant="primary" className="w-full text-white py-4 text-lg" isLoading={isSubmitting}>
                Submit Request for Review
              </Button>
            </div>
            
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
