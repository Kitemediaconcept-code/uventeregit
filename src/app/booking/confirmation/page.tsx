'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { getBookings, BookingRecord, formatDate, formatCurrency } from '@/lib/utils';
import { CheckCircle, Calendar, MapPin, Download, Share2, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const router = useRouter();
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (!ref) {
      router.push('/dashboard/bookings');
      return;
    }
    const allBookings = getBookings();
    const found = allBookings.find(b => b.bookingRef === ref);
    if (!found) {
      router.push('/dashboard/bookings');
      return;
    }
    setBooking(found);
  }, [ref, router]);

  if (!booking) return null;

  return (
    <div className="container py-20 min-h-[85vh] flex items-center justify-center relative">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
         <div className="orb orb-cyan w-[600px] h-[600px] top-[10%] right-[10%]" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle size={40} />
          </div>
          <h1 className="heading-lg mb-2">Booking <span className="text-gradient">Confirmed</span>!</h1>
          <p className="text-slate-300 text-lg">Your tickets are ready. We've sent a confirmation email to you.</p>
        </div>

        <GlassCard padding="lg" className="border-t-green-500/50 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <CheckCircle size={300} />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-white/10 pb-8 mb-8">
            <div className="bg-white p-4 rounded-2xl flex-shrink-0">
              <QRCodeSVG 
                value={`UVENTERE-TICKET-${booking.bookingRef}`}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-slate-300 mb-3">
                REF: {booking.bookingRef}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{booking.eventTitle}</h2>
              <div className="flex flex-col gap-2 text-slate-300">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar size={16} className="text-purple-400"/> {formatDate(booking.eventDate)}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={16} className="text-cyan-400"/> {booking.eventVenue}, {booking.eventCity}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ticket Type</p>
              <p className="text-white font-medium">{booking.ticketType}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Quantity</p>
              <p className="text-white font-medium">{booking.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="text-white font-medium">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <p className="text-green-400 font-medium flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-green-400" /> Confirmed
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glass" className="w-full sm:w-auto text-sm" leftIcon={<Download size={16}/>}>
              Download Ticket
            </Button>
            <Button variant="glass" className="w-full sm:w-auto text-sm" leftIcon={<Share2 size={16}/>}>
              Share
            </Button>
            <Link href="/dashboard/bookings" className="btn-primary w-full sm:w-auto text-sm justify-center">
              View All Bookings <ArrowRight size={16}/>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-white">Verifying Booking...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
