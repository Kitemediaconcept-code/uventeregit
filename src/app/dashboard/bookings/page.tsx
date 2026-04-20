'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassCard';
import { getBookings, BookingRecord, formatCurrency, formatDate, cancelBooking } from '@/lib/utils';
import { Calendar, MapPin, XCircle, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function BookingsList() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBooking(id);
      setBookings(getBookings()); // refresh
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-md mb-2">My <span className="text-gradient">Bookings</span></h1>
        <p className="text-slate-400">Manage all your event tickets and reservations.</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map(b => {
             const isCancelled = b.status === 'cancelled';
             
             return (
              <GlassPanel key={b.id} className={`p-6 rounded-[32px] overflow-hidden relative ${isCancelled ? 'opacity-70 grayscale-[50%]' : ''}`}>
                {/* Status Ribbon */}
                <div className={`absolute top-6 right-0 pl-10 pr-6 py-1 bg-gradient-to-r ${isCancelled ? 'from-transparent to-red-600/50' : 'from-transparent to-green-600/50'} text-white text-xs font-bold uppercase tracking-wider`}>
                  {b.status}
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden relative">
                    <img src={b.eventImage} alt="" className="w-full h-full object-cover" />
                    {isCancelled && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold backdrop-blur-sm">CANCELLED</div>}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-16">
                    <div className="text-xs text-slate-400 font-mono mb-1">REF: {b.bookingRef}</div>
                    <Link href={`/events/${b.eventId}`} className="text-xl font-bold text-white mb-2 hover:text-red-400 transition-colors line-clamp-1 inline-flex items-center gap-2">
                       {b.eventTitle} <ExternalLink size={16} />
                    </Link>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar size={16} className="text-red-400" /> {formatDate(b.eventDate)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin size={16} className="text-red-400" /> {b.eventVenue}, {b.eventCity}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">{b.quantity}x {b.ticketType}</div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(b.totalAmount)}</div>
                    </div>
                    
                    {!isCancelled && (
                      <div className="flex gap-2">
                        <Link href={`/booking/confirmation?ref=${b.bookingRef}`} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Download Ticket">
                          <Download size={18} />
                        </Link>
                        <button onClick={() => handleCancel(b.id)} className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Cancel Booking">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      ) : (
        <GlassPanel className="text-center py-20 rounded-[32px]">
          <Calendar size={48} className="mx-auto mb-4 text-slate-500" />
          <h3 className="text-2xl font-bold text-white mb-2">No bookings found</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">You haven't booked any events yet. Start exploring to find your next great experience.</p>
          <Link href="/events" className="btn-primary">Browse Events</Link>
        </GlassPanel>
      )}
    </div>
  );
}
