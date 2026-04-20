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
    <div className="flex flex-col gap-0 w-full mb-20 overflow-hidden">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
        <div className="container relative z-10 grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Hero Left: Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col justify-center max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-medium w-fit mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Premium Event Experiences
            </div>
            <h1 className="heading-xl mb-6">
              Plan Your <span className="text-gradient">Perfect</span> Event Effortlessly
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Discover, book, and manage exclusive events with top coordinators. Turn your vision into an unforgettable reality with our premium platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/events" className="btn-primary">
                Explore Events <ChevronRight size={18} />
              </Link>
              <Link href="/custom-event" className="btn-glass">
                Request Custom Event
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <img src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&img=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center text-gold mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-slate-500 font-medium">Trusted by <span className="text-slate-900 font-extrabold">10k+</span> users worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Right: Booking Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Find Your Event</h3>
              <form className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                  <select className="select-glass w-full !pl-4">
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="City or venue" className="input-glass w-full pl-[44px]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="date" className="input-glass w-full pl-[44px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                    <select className="select-glass w-full !pl-4">
                      <option value="">Any</option>
                      <option value="high">₹10K+</option>
                      <option value="med">₹3K - ₹10K</option>
                      <option value="low">Under ₹3K</option>
                    </select>
                  </div>
                </div>
                <Button variant="primary" className="w-full mt-2" size="lg" onClick={(e) => { e.preventDefault(); window.location.href='/events'; }}>
                  Search Now
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Stats Section ── */}
      <section className="section-sm relative z-10 border-y border-slate-100 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: '500+', label: 'Events Hosted' },
              { value: '50K+', label: 'Happy Attendees' },
              { value: '200+', label: 'Top Coordinators' },
              { value: '4.9/5', label: 'Average Rating' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <h4 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">{stat.value}</h4>
                <span className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Events ── */}
      <section className="section relative z-10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-slate-900">Featured <span className="text-gradient">Events</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed text-center">Don't miss out on the most anticipated events of the year. Curated just for you.</p>
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
            <h2 className="heading-lg mb-6 text-slate-900">Browse by <span className="text-gradient">Category</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed">Whatever you're looking for, we've got the perfect event type ready to explore.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(category => (
              <Link key={category.id} href={`/events?category=${category.id}`} className="group no-underline">
                <GlassCard padding="lg" className="flex flex-col items-center justify-center text-center h-full hover:border-red-500/20">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-white"
                    style={{ border: `1px solid ${category.color}40`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-red-500 transition-colors">{category.name}</h3>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="section relative z-10 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-slate-900">How It <span className="text-gradient">Works</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed">Your journey to the perfect event is just four simple steps away.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-red-500/10 auto transparent z-[-1]" />
            
            {[
              { num: '01', title: 'Discover', desc: 'Browse our curated list of premium events and coordinators based on your preferences.' },
              { num: '02', title: 'Customize', desc: 'Select tickets, add-ons, or request a fully customized event package.' },
              { num: '03', title: 'Book Securely', desc: 'Confirm your booking with our secure payment gateway and instant ticketing.' },
              { num: '04', title: 'Experience', desc: 'Attend your event with a digital QR ticket and enjoy a flawless experience.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-[120px] h-[120px] rounded-full glass flex items-center justify-center mb-6 relative overflow-hidden group bg-white shadow-sm border border-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-400 group-hover:from-red-500 group-hover:to-red-400 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="section relative z-10 border-t border-slate-100 overflow-hidden bg-white">
        <div className="container mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6 text-slate-900">Impact <span className="text-gradient">Stories</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed">Real experiences, real results. Hear from those we've transformed.</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex animate-marquee items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none hover:[animation-play-state:paused] py-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <GlassCard key={i} padding="md" className="w-[400px] flex-shrink-0 mx-4 border-l-red-500 border-l-[3px] bg-white shadow-sm">
                <div className="flex gap-1 text-gold mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 text-[15px] italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role} • {t.event}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA Section ── */}
      <section className="section relative z-10">
        <div className="container">
          <GlassPanel className="relative overflow-hidden p-12 md:p-20 text-center rounded-[40px] border-red-500/10 shadow-xl bg-white">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-white to-red-50" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="heading-lg mb-6 text-slate-900">Ready to Elevate Your Next Event?</h2>
              <p className="text-xl text-slate-600 mb-10">
                Join thousands of users who have transformed their event ideas into spectacular realities. Connect with coordinators today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events" className="btn-primary space-x-2">
                  <span>Browse Events</span> <ArrowRight size={18} />
                </Link>
                <Link href="/auth/signup" className="btn-glass space-x-2">
                  <Users size={18} /> <span>Join as Member</span>
                </Link>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

    </div>
  );
}
