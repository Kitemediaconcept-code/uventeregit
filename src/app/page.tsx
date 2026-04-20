'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Users, MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/events/EventCard';
import { EVENTS, CATEGORIES, COORDINATORS, TESTIMONIALS, type Event } from '@/lib/data';
import { supabase } from '@/lib/supabase';

// Variants for Framer Motion
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
};

export default function Home() {
  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const featuredEvents = EVENTS.filter(e => e.isFeatured).slice(0, 4);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      const { data } = await supabase.from('event_requests').select('*').eq('status', 'approved');
      if (data && data.length > 0) {
        const formatted: Event[] = data.map((d: any) => ({
          id: d.id,
          title: d.event_name,
          category: 'Bespoke',
          categoryColor: '#ff3131',
          isHot: true,
          isFeatured: true,
          image: d.media_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
          date: d.created_at,
          time: 'Custom Time',
          venue: 'TBD',
          city: 'Custom Location',
          price: 0, // Request-based pricing
          coordinator: d.full_name,
          coordinatorAvatar: '',
          rating: 5.0,
          booked: Math.floor(Math.random() * 50),
          capacity: 100,
          description: d.description,
          attendeesPreview: [],
          ticketTypes: [],
          tags: []
        }));
        setDbEvents(formatted);
      }
    };
    fetchApprovedEvents();
  }, []);

  const displayEvents = dbEvents.length > 0 ? dbEvents.slice(0, 4) : featuredEvents;

  return (
    <div className="flex flex-col gap-0 w-full mb-20 overflow-hidden relative">
      {/* ── Aurora Background Orbs ── */}
      <div className="orb orb-purple w-[600px] h-[600px] -top-[200px] -left-[100px] opacity-20" />
      <div className="orb orb-cyan w-[500px] h-[500px] top-[10%] -right-[100px] opacity-10" />
      <div className="orb orb-pink w-[700px] h-[700px] top-[40%] -left-[200px] opacity-10" />
      
      {/* ── 1. Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center pt-40 pb-32">
        <div className="container relative z-10 flex flex-col items-center text-center">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 text-sm font-medium mb-10 tracking-wide uppercase text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Premium Event Experiences
            </div>
            <h1 className="heading-xl mb-8 !leading-[1.1] tracking-tight">
              Plan Your <span className="text-indigo-600">Perfect</span> Event <br className="hidden md:block" /> with Absolute Simplicity
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
              Discover, book, and manage exclusive events with top coordinators. Turn your vision into an unforgettable reality with our premium platform.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
              <Link href="/events" className="btn-primary !px-8 !py-4 shadow-xl shadow-indigo-200">
                Explore Events <ChevronRight size={18} />
              </Link>
              <Link href="/custom-event" className="btn-glass !px-8 !py-4">
                Request Custom Event
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mb-24">
              <div className="flex -space-x-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-11 h-11 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&img=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-left">
                <div className="flex items-center text-gold mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={15} fill="currentColor" />)}
                </div>
                <span className="text-slate-500 font-medium">Trusted by <span className="text-indigo-600 font-bold">10k+</span> users worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Booking Form Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-5xl"
          >
            <div className="glass shadow-2xl p-4 md:p-6 rounded-[40px] border-white/50">
              <form className="grid grid-cols-1 md:grid-cols-4 items-end gap-4">
                <div className="text-left px-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Event Type</label>
                  <select className="select-glass !bg-transparent !p-0 !border-none !shadow-none !text-lg font-medium">
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="text-left px-4 border-l border-slate-100 hidden md:block">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Location</label>
                  <div className="relative">
                    <input type="text" placeholder="City or venue" className="input-glass !bg-transparent !p-0 !border-none !shadow-none !text-lg font-medium w-full" />
                  </div>
                </div>
                <div className="text-left px-4 border-l border-slate-100 hidden md:block">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Budget</label>
                  <select className="select-glass !bg-transparent !p-0 !border-none !shadow-none !text-lg font-medium">
                    <option value="">Any</option>
                    <option value="high">₹10K+</option>
                    <option value="med">₹3K - ₹10K</option>
                    <option value="low">Under ₹3K</option>
                  </select>
                </div>
                <div className="px-2">
                  <Button variant="primary" className="w-full !rounded-[24px] !py-4 shadow-lg shadow-indigo-200" size="lg" onClick={(e) => { e.preventDefault(); window.location.href='/events'; }}>
                    Search Now
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Stats Section ── */}
      <section className="py-24 relative z-10 border-y border-slate-100 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { value: '500+', label: 'Events Hosted' },
              { value: '50K+', label: 'Happy Attendees' },
              { value: '200+', label: 'Top Coordinators' },
              { value: '4.9/5', label: 'Average Rating' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <h4 className="text-5xl md:text-6xl font-black text-indigo-600 mb-4">{stat.value}</h4>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Events ── */}
      <section className="section relative z-10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-slate-900">Featured <span className="text-indigo-600 font-medium">Events</span></h2>
            <p className="text-slate-500 text-xl leading-relaxed text-center">Don't miss out on the most anticipated events of the year. Curated just for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayEvents.map((event, idx) => (
              <EventCard key={event.id || idx} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Categories ── */}
      <section className="section relative z-10 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-slate-900">Browse by <span className="text-indigo-600 font-medium">Category</span></h2>
            <p className="text-slate-500 text-xl leading-relaxed">Whatever you're looking for, we've got the perfect event type ready to explore.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(category => (
              <Link key={category.id} href={`/events?category=${category.id}`} className="group no-underline">
                <div className="bg-white p-8 border border-slate-100 rounded-[32px] shadow-sm flex flex-col items-center justify-center text-center h-full hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-slate-50"
                    style={{ border: `1px solid ${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="section relative z-10 bg-slate-50/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-slate-900">How It <span className="text-indigo-600 font-medium">Works</span></h2>
            <p className="text-slate-500 text-xl leading-relaxed">Your journey to the perfect event is just four simple steps away.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/10 auto transparent z-[-1]" />
            
            {[
              { num: '01', title: 'Discover', desc: 'Browse our curated list of premium events and coordinators based on your preferences.' },
              { num: '02', title: 'Customize', desc: 'Select tickets, add-ons, or request a fully customized event package.' },
              { num: '03', title: 'Book Securely', desc: 'Confirm your booking with our secure payment gateway and instant ticketing.' },
              { num: '04', title: 'Experience', desc: 'Attend your event with a digital QR ticket and enjoy a flawless experience.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center mb-6 relative overflow-hidden shadow-sm border border-slate-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-indigo-500/10 group-hover:border-indigo-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-400 group-hover:from-indigo-600 group-hover:to-indigo-400 transition-all duration-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="section relative z-10 border-t border-slate-50 overflow-hidden bg-white">
        <div className="container mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6 text-slate-900">Impact <span className="text-indigo-600 font-medium">Stories</span></h2>
            <p className="text-slate-500 text-xl leading-relaxed">Real experiences, real results. Hear from those we've transformed.</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex animate-marquee items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none hover:[animation-play-state:paused] py-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-[420px] flex-shrink-0 mx-4 p-8 rounded-[32px] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <div className="flex gap-1 text-gold mb-5">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={15} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 text-[16px] leading-[1.6] italic mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover grayscale opacity-80" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{t.name}</h4>
                    <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA Section ── */}
      <section className="section relative z-10">
        <div className="container">
          <div className="relative overflow-hidden p-16 md:p-24 text-center rounded-[48px] bg-indigo-600 shadow-2xl shadow-indigo-200">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800" />
            
            {/* CTA Aurora Orbs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight">Ready to Elevate Your Next Event?</h2>
              <p className="text-xl text-indigo-100 opacity-90 mb-12 leading-relaxed">
                Join thousands of users who have transformed their event ideas into spectacular realities. Connect with coordinators today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/events" className="bg-white text-indigo-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <span>Browse Events</span> <ArrowRight size={20} />
                </Link>
                <Link href="/auth/signup" className="border border-white/20 bg-white/5 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <Users size={20} /> <span>Join as Member</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
