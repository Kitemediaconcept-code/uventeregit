'use client';

import { useState } from 'react';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Sparkles, Calendar, MapPin, DollarSign, PenTool, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CustomEventRequest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    eventType: '',
    dateStr: '',
    city: '',
    guests: '50-100',
    budget: '',
    description: '',
    name: '',
    email: '',
    phone: ''
  });

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Custom event request sent successfully!');
      
      // Auto redirect after a few seconds
      setTimeout(() => {
        router.push('/');
      }, 5000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container py-20 min-h-[80vh] flex items-center justify-center">
        <GlassCard padding="lg" className="max-w-xl text-center border-t-green-500/50">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="heading-md mb-4">Request Sent Successfully!</h2>
          <p className="text-slate-300 text-lg mb-8">
            Thank you, {formData.name}. Our elite coordination team has received your request and will contact you within 24 hours to discuss bringing your vision to life.
          </p>
          <Button onClick={() => router.push('/')} variant="outline">Return to Home</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-screen relative">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
         <div className="orb orb-pink w-[600px] h-[600px] top-[20%] right-[-10%]" />
      </div>

      <div className="max-w-3xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm font-medium w-fit mb-6">
          <Sparkles size={16} /> Bespoke Planning
        </div>
        <h1 className="heading-lg mb-4">Plan a <span className="text-gradient">Custom Event</span></h1>
        <p className="text-lg text-slate-300">Share your vision with us, and our elite coordinators will craft an unforgettable experience tailored entirely to you.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300 ${
                step >= num 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' 
                  : 'bg-[#0d0d20] border-2 border-white/10 text-slate-500'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <GlassCard padding="lg" className="border-t-purple-500/30">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: The Basics */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold text-white mb-6">1. The Basics</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">What type of event are you planning?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => updateForm('eventType', cat.id)}
                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                          formData.eventType === cat.id 
                            ? 'bg-purple-500/20 border-2 border-purple-500 text-white' 
                            : 'bg-white/5 border-2 border-transparent text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="date" className="input-glass pl-11" value={formData.dateStr} onChange={e => updateForm('dateStr', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">City / Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" placeholder="E.g. Mumbai" className="input-glass pl-11" value={formData.city} onChange={e => updateForm('city', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Scale & Budget */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold text-white mb-6">2. Scale & Budget</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-4">Estimated Guest Count</label>
                  <div className="flex flex-wrap gap-3">
                    {['Under 50', '50-100', '100-250', '250-500', '500+'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateForm('guests', g)}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.guests === g 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Budget Range</label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select className="select-glass pl-11" value={formData.budget} onChange={e => updateForm('budget', e.target.value)}>
                      <option value="">Select budget range...</option>
                      <option value="under50k">Under ₹50,000</option>
                      <option value="50k-2L">₹50,000 - ₹2 Lakhs</option>
                      <option value="2L-10L">₹2 Lakhs - ₹10 Lakhs</option>
                      <option value="10L+">Premium (₹10 Lakhs+)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: The Vision */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold text-white mb-6">3. The Vision</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Describe your dream event</label>
                  <div className="relative">
                    <PenTool size={18} className="absolute left-4 top-4 text-slate-500" />
                    <textarea 
                      rows={5}
                      className="input-glass pl-11 py-4 leading-relaxed" 
                      placeholder="Tell us about the theme, specific requirements, or any special requests you have..."
                      value={formData.description}
                      onChange={e => updateForm('description', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">More details will help us match you with the perfect premium coordinator.</p>
                </div>
              </div>
            </div>

            {/* STEP 4: Contact Info */}
            <div className={step === 4 ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold text-white mb-6">4. Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input type="text" className="input-glass" required value={formData.name} onChange={e => updateForm('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                  <input type="email" className="input-glass" required value={formData.email} onChange={e => updateForm('email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                  <input type="tel" className="input-glass" required value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Form Controls */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="text-slate-400 hover:text-white font-medium px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
                  ← Back
                </button>
              ) : <div />}
              
              {step < 4 ? (
                <Button type="button" onClick={handleNext} variant="primary" disabled={step === 1 && !formData.eventType}>
                  Next Step
                </Button>
              ) : (
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Submit Request
                </Button>
              )}
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  );
}
