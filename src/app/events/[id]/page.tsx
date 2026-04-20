'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EVENTS } from '@/lib/data';
import { formatCurrency, formatDate, setCart } from '@/lib/utils';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, Users, Star, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(EVENTS.find(e => e.id === id));
  
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="container py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-slate-400 mb-8">The event you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/events')} variant="outline">Browse Events</Button>
      </div>
    );
  }

  const ticket = event.ticketTypes[selectedTicket];
  const total = ticket ? ticket.price * quantity : 0;

  const handleBookNow = () => {
    if (!ticket) return;
    
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('uventere_user');
    if (!isLoggedIn) {
      toast.error('Please login to book tickets', { icon: '🔒' });
      router.push('/auth/login?redirect=' + encodeURIComponent(`/events/${id}`));
      return;
    }

    // Save to cart session
    setCart({
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.date,
      eventVenue: event.venue,
      eventCity: event.city,
      ticketType: ticket.type,
      quantity: quantity,
      unitPrice: ticket.price
    });

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      {/* ── Hero Banner ── */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <div className="absolute inset-0 bg-white">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-white/40 to-transparent" />
        </div>
        
        <div className="container relative h-full flex flex-col justify-end pb-12 z-10">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 backdrop-blur-md flex items-center justify-center text-slate-800 mb-6 transition-colors border border-black/5"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="badge" style={{ background: `${event.categoryColor}15`, color: event.categoryColor, border: `1px solid ${event.categoryColor}30` }}>
              {event.category.toUpperCase()}
            </span>
            {event.isHot && <span className="badge badge-red">HOT SELLING</span>}
          </div>

          <h1 className="heading-lg text-slate-900 mb-4 max-w-4xl">{event.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-red-500" /> {formatDate(event.date)}</div>
            <div className="flex items-center gap-2"><Clock size={18} className="text-red-400" /> {event.time}</div>
            <div className="flex items-center gap-2"><MapPin size={18} className="text-red-500" /> {event.venue}, {event.city}</div>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
          
          {/* ── Main Content ── */}
          <div className="flex-1 w-full space-y-12">
            
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Info size={24} className="text-red-500"/> About Event</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {event.description}
              </p>
            </section>

            {/* Coordinator Info */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-slate-800">Organized By</h2>
              <GlassCard padding="sm" className="flex items-center gap-4 bg-white/50 border-black/5 shadow-sm">
                <img src={event.coordinatorAvatar} alt={event.coordinator} className="w-16 h-16 rounded-full object-cover border-2 border-red-500/20" />
                <div>
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {event.coordinator}
                    <CheckCircle2 size={16} className="text-red-500" />
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Star size={14} className="text-gold fill-gold" /> {event.rating} Rating
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </GlassCard>
            </section>

            {/* Event Stats / Highlights */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <GlassPanel className="p-4 text-center bg-white shadow-sm border-black/5">
                <Users size={24} className="mx-auto mb-2 text-red-400" />
                <div className="text-xl font-bold text-slate-900">{event.capacity}</div>
                <div className="text-xs text-slate-500">Capacity</div>
              </GlassPanel>
              <GlassPanel className="p-4 text-center bg-white shadow-sm border-black/5">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-red-500" />
                <div className="text-xl font-bold text-slate-900">{Math.round((event.booked / event.capacity) * 100)}%</div>
                <div className="text-xs text-slate-500">Booked</div>
              </GlassPanel>
            </section>

          </div>

          {/* ── Sticky Sidebar (Booking Widget) ── */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-28">
            <GlassCard padding="lg" glowOnHover className="border-t-red-500/20 border-t-2 shadow-2xl bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Select Tickets</h3>
              
              <div className="space-y-4 mb-6">
                {event.ticketTypes.map((t, idx) => (
                  <label 
                    key={idx} 
                    className={`block relative p-4 rounded-[20px] border cursor-pointer transition-all ${
                      selectedTicket === idx 
                        ? 'bg-red-50 border-red-500 shadow-[0_0_15px_rgba(255,49,49,0.1)]' 
                        : 'bg-[#f8fafc] border-black/5 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="ticketType" 
                      className="sr-only" 
                      checked={selectedTicket === idx}
                      onChange={() => setSelectedTicket(idx)}
                    />
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-bold ${selectedTicket === idx ? 'text-slate-900' : 'text-slate-700'}`}>{t.type}</span>
                      <span className="font-bold text-lg text-slate-900">{formatCurrency(t.price)}</span>
                    </div>
                    <ul className="space-y-1">
                      {t.perks.map((p, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 size={12} className={selectedTicket === idx ? 'text-red-500' : 'text-slate-400'} /> {p}
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6 p-4 bg-[#f8fafc] rounded-[20px] border border-black/5">
                <span className="text-slate-700 font-medium">Quantity</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 text-slate-800"
                  >-</button>
                  <span className="font-bold w-4 text-center text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 text-slate-800"
                  >+</button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-end mb-6">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <Button variant="primary" className="w-full py-4 text-lg text-white" onClick={handleBookNow}>
                Proceed to Checkout
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4">Secure payment via Razorpay. Taxes applied at checkout.</p>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
