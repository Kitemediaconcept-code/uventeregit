'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Users, MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/events/EventCard';
import { EVENTS, CATEGORIES, TESTIMONIALS, type Event } from '@/lib/data';
import { supabase } from '@/lib/supabase';

// Variants for Framer Motion
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
          categoryColor: '#07715F',
          isHot: true,
          isFeatured: true,
          image: d.media_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
          date: d.created_at,
          time: 'Custom Time',
          venue: 'TBD',
          city: 'Custom Location',
          price: 0,
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
    <div className="flex flex-col gap-0 w-full mb-20 overflow-hidden relative bg-white">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-end pt-40 pb-12 mx-4 md:mx-8 mt-4 rounded-[32px] overflow-hidden bg-zinc-900">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2500')" }}
        />
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />

        <div className="container relative z-10 w-full pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col max-w-6xl text-left text-white mb-16"
          >
            <h1 className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-[-.04em] uppercase mb-8">
              Experience<br />The <span className="text-[#51C67E]">Extraordinary</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-medium leading-relaxed">
              We are a modern event experience platform built to bring people together. From world-class conferences to creative festivals, discover your next unforgettable moment.
            </p>
          </motion.div>

          {/* Eventry Style Booking Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="w-full bg-white text-black rounded-[24px] p-6 md:p-8 shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 xl:gap-12 md:divide-x divide-gray-200">
              <div className="flex flex-col md:pl-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Event Category</span>
                <select className="bg-transparent border-none outline-none font-bold text-xl md:text-2xl p-0 cursor-pointer text-black">
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col md:pl-12">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Location</span>
                <input type="text" placeholder="City or venue" className="bg-transparent border-none outline-none font-bold text-xl md:text-2xl p-0 placeholder-gray-300 w-full" />
              </div>
              <div className="flex flex-col md:pl-12">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Budget</span>
                <select className="bg-transparent border-none outline-none font-bold text-xl md:text-2xl p-0 cursor-pointer text-black">
                  <option value="">Any Budget</option>
                  <option value="high">Premium ($1k+)</option>
                  <option value="med">Standard</option>
                </select>
              </div>
            </div>
            <div className="w-full xl:w-auto shrink-0 mt-4 xl:mt-0">
               <Link href="/events" className="btn-primary !w-full xl:!w-auto !py-5 !px-12 text-lg uppercase tracking-wider">
                 Find Events
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Stats Section ── */}
      <section className="py-24 relative z-10 bg-white">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-12 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-y border-gray-200 py-12">
            {[
              { value: '500+', label: 'Events Hosted' },
              { value: '50K+', label: 'Attendees' },
              { value: '200+', label: 'Expert Coordinators' },
              { value: '4.9/5', label: 'Average Rating' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center w-full md:w-[22%] pt-8 md:pt-0">
                <h4 className="text-5xl md:text-7xl font-black text-black mb-3 tracking-tighter">{stat.value}</h4>
                <span className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Events ── */}
      <section className="section bg-zinc-50 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="heading-lg mb-4">Our Main <span className="text-[#07715F]">Events</span></h2>
              <p className="text-gray-500 text-xl leading-relaxed">Explore the key sessions, speakers, and premium experiences waiting for you this year.</p>
            </div>
            <Link href="/events" className="btn-outline shrink-0">
              View All Events
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayEvents.map((event, idx) => (
              <EventCard key={event.id || idx} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Categories ── */}
      <section className="section bg-white relative z-10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6">Browse by <span className="text-[#07715F]">Category</span></h2>
            <p className="text-gray-500 text-xl leading-relaxed">Whatever you're looking for, we've got the perfect event type ready to explore.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map(category => (
              <Link key={category.id} href={`/events?category=${category.id}`} className="group no-underline">
                <div className="bg-zinc-50 p-10 border border-gray-100 rounded-[24px] flex flex-col items-center justify-center text-center h-full hover:bg-white hover:shadow-xl hover:border-[#51C67E] transition-all duration-300">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 transition-transform group-hover:scale-110 bg-white shadow-sm"
                    style={{ color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#07715F] transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="section bg-zinc-900 text-white relative z-10 mx-4 md:mx-8 rounded-[32px] overflow-hidden my-10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg mb-6 text-white">How It <span className="text-[#51C67E]">Works</span></h2>
            <p className="text-gray-400 text-xl leading-relaxed">Your journey to the perfect event is just four simple steps away.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[1px] bg-white/20 z-0" />
            
            {[
              { num: '01', title: 'Discover', desc: 'Browse our curated list of premium events and coordinators based on your preferences.' },
              { num: '02', title: 'Customize', desc: 'Select tickets, add-ons, or request a fully customized event package.' },
              { num: '03', title: 'Book Securely', desc: 'Confirm your booking with our secure payment gateway and instant ticketing.' },
              { num: '04', title: 'Experience', desc: 'Attend your event with a digital QR ticket and enjoy a flawless experience.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10">
                <div className="w-[100px] h-[100px] rounded-full bg-[#07715F] flex items-center justify-center mb-8 border-4 border-zinc-900">
                  <span className="text-3xl font-black text-white">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="section bg-white relative z-10 border-b border-gray-100 overflow-hidden">
        <div className="container mb-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="heading-lg mb-4">Attendee <span className="text-[#07715F]">Feedback</span></h2>
              <p className="text-gray-500 text-xl leading-relaxed">Real experiences, real results. Hear from those we've transformed.</p>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex animate-marquee items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none hover:[animation-play-state:paused] py-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-[450px] flex-shrink-0 mx-4 p-10 rounded-[24px] border border-gray-200 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 text-[#07715F] mb-6">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-black text-lg leading-relaxed font-medium mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover grayscale" />
                  <div>
                    <h4 className="font-bold text-black text-base">{t.name}</h4>
                    <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA Section ── */}
      <section className="section bg-white relative z-10">
        <div className="container">
          <div className="bg-[#51C67E] rounded-[32px] p-16 md:p-24 text-center overflow-hidden relative">
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-[8vw] md:text-6xl font-black mb-8 text-black tracking-tighter uppercase leading-[0.9]">Ready to Elevate <br /> Your Next Event?</h2>
              <p className="text-xl md:text-2xl text-black/80 font-medium mb-12 leading-relaxed">
                Join thousands of users who have transformed their event ideas into spectacular realities.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/events" className="bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <span>Browse Events</span> <ArrowRight size={20} />
                </Link>
                <Link href="/auth/signup" className="border-2 border-black bg-transparent text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
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
