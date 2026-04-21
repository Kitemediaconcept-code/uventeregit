'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
    <div className="container py-20 min-h-[85vh] flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#07715F]/10 text-[#07715F] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#07715F]/20">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-black text-black mb-3 tracking-tighter">
            Booking <span className="text-[#07715F]">Confirmed</span>!
          </h1>
          <p className="text-gray-500 text-lg">Your tickets are ready. We've sent a confirmation email to you.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-zinc-50 border border-gray-200 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-sm">
          {/* Subtle Watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none text-[#07715F]">
            <CheckCircle size={260} />
          </div>

          {/* QR + Event Info Row */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-gray-200 pb-8 mb-8">
            <div className="bg-white p-4 rounded-2xl flex-shrink-0 border border-gray-200 shadow-sm">
              <QRCodeSVG 
                value={`UVENTERE-TICKET-${booking.bookingRef}`}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#07715F]/10 border border-[#07715F]/20 text-xs font-mono font-bold text-[#07715F] mb-4 uppercase tracking-widest">
                REF: {booking.bookingRef}
              </div>
              <h2 className="text-2xl font-black text-black mb-3 leading-tight">{booking.eventTitle}</h2>
              <div className="flex flex-col gap-2.5 text-gray-600">
                <div className="flex items-center justify-center md:justify-start gap-2 font-medium">
                  <Calendar size={16} className="text-[#07715F]"/> {formatDate(booking.eventDate)}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 font-medium">
                  <MapPin size={16} className="text-[#07715F]"/> {booking.eventVenue}, {booking.eventCity}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Ticket Type', value: booking.ticketType },
              { label: 'Quantity', value: String(booking.quantity) },
              { label: 'Amount Paid', value: formatCurrency(booking.totalAmount) },
              { label: 'Status', value: 'Confirmed', isStatus: true },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                {item.isStatus ? (
                  <p className="text-[#07715F] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#07715F]" /> Confirmed
                  </p>
                ) : (
                  <p className="text-black font-bold text-lg">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-outline w-full sm:w-auto text-sm flex items-center justify-center gap-2">
              <Download size={16}/> Download Ticket
            </button>
            <button className="btn-outline w-full sm:w-auto text-sm flex items-center justify-center gap-2">
              <Share2 size={16}/> Share
            </button>
            <Link href="/dashboard/bookings" className="btn-primary w-full sm:w-auto text-sm flex items-center justify-center gap-2">
              View All Bookings <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-black font-medium">Verifying Booking...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
