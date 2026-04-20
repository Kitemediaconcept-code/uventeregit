'use client';

import { useState, useEffect } from 'react';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { getBookings, BookingRecord, formatCurrency } from '@/lib/utils';
import { Calendar, Ticket, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { EVENTS } from '@/lib/data';

export default function DashboardOverview() {
  const [userName, setUserName] = useState('');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('uventere_user');
    if (userStr) setUserName(JSON.parse(userStr).name);
    setBookings(getBookings());
  }, []);

  const totalSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-md mb-2">Welcome back, <span className="text-gradient">{userName}</span></h1>
        <p className="text-slate-400">Here's an overview of your account and upcoming events.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard padding="sm" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{bookings.length}</div>
            <div className="text-sm text-slate-400">Total Bookings</div>
          </div>
        </GlassCard>
        
        <GlassCard padding="sm" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Ticket size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{bookings.reduce((sum, b) => sum + b.quantity, 0)}</div>
            <div className="text-sm text-slate-400">Tickets Purchased</div>
          </div>
        </GlassCard>

        <GlassCard padding="sm" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-slate-400">Total Spent</div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassPanel className="p-6 sm:p-8 rounded-[32px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <Link href="/dashboard/bookings" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View All <ArrowRight size={14}/>
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <img src={b.eventImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-white line-clamp-1">{b.eventTitle}</h4>
                  <p className="text-sm text-slate-400">{b.quantity}x {b.ticketType} Ticket</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{formatCurrency(b.totalAmount)}</div>
                  <div className="text-xs text-green-400">Confirmed</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5">
            <Calendar size={32} className="mx-auto mb-3 text-slate-500" />
            <p className="text-slate-400 mb-4">You don't have any bookings yet.</p>
            <Link href="/events" className="btn-outline text-sm">Browse Events</Link>
          </div>
        )}
      </GlassPanel>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.slice(3, 6).map(event => (
            <EventCard key={event.id} event={event} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
