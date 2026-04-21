'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, CreditCard, ShieldCheck, Ticket, User, Lock } from 'lucide-react';
import { getCart, formatCurrency, formatDate, saveBooking, generateBookingRef, clearCart, CartItem } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCartData] = useState<CartItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    // 1. Check user
    const userStr = localStorage.getItem('uventere_user');
    if (!userStr) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    setUser(JSON.parse(userStr));

    // 2. Check cart
    const activeCart = getCart();
    if (!activeCart) {
      router.push('/events');
      return;
    }
    setCartData(activeCart);
  }, [router]);

  if (!cart || !user) return <div className="min-h-screen relative"><div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#07715F] border-t-transparent animate-spin rounded-full"></div></div></div>;

  const totalAmount = cart.quantity * cart.unitPrice;
  const platformFee = totalAmount * 0.05; // 5% fee
  const tax = (totalAmount + platformFee) * 0.18; // 18% GST (Indian tax mock)
  const finalTotal = totalAmount + platformFee + tax;

  const handlePayment = () => {
    setIsProcessing(true);

    // Mock Razorpay / Stripe flow delay
    setTimeout(() => {
      // Create final booking record
      const booking = {
        id: 'bk_' + Math.random().toString(36).substr(2, 9),
        bookingRef: generateBookingRef(),
        eventId: cart.eventId,
        eventTitle: cart.eventTitle,
        eventDate: cart.eventDate,
        eventVenue: cart.eventVenue,
        eventCity: cart.eventCity,
        eventImage: cart.eventImage,
        ticketType: cart.ticketType,
        quantity: cart.quantity,
        unitPrice: cart.unitPrice,
        totalAmount: finalTotal,
        status: 'confirmed' as const,
        bookedAt: new Date().toISOString(),
        paymentMethod: 'Card (Mocked)',
      };

      // Save to localStorage
      saveBooking(booking);
      
      // Clear Cart
      clearCart();

      // Show success and redirect
      toast.success('Payment successful!');
      router.push(`/booking/confirmation?ref=${booking.bookingRef}`);
      
    }, 2500);
  };

  return (
    <div className="container py-12 min-h-[85vh] bg-white">
      <h1 className="heading-lg mb-8 text-black">Secure <span className="text-[#07715F]">Checkout</span></h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Payment Form (Mocked UI) */}
        <div className="w-full lg:w-[60%] space-y-6">
          <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2"><User size={20} className="text-[#07715F]"/> Primary Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                <input type="text" className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-black outline-none" defaultValue={user.name} disabled />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <input type="email" className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-black outline-none" defaultValue={user.email} disabled />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2"><CreditCard size={20} className="text-[#07715F]"/> Payment Method</h3>
            
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-50 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-800">This is a mock UI. No real payment will be processed. Clicking 'Pay Now' will immediately simulate a successful booking.</p>
            </div>

            <div className="space-y-4 opacity-50 pointer-events-none">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Card Number</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black outline-none font-mono" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Expiry</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black outline-none" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">CVV</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black outline-none" placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="w-full lg:w-[40%] shrink-0">
          <div className="bg-zinc-50 border border-gray-200 rounded-[24px] p-8 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>

            {/* Event Info */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src={cart.eventImage} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
              <div>
                <h4 className="font-bold text-black line-clamp-2">{cart.eventTitle}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Calendar size={12}/> {formatDate(cart.eventDate)}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/> {cart.eventCity}</p>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 flex items-center gap-2"><Ticket size={16} className="text-[#07715F]"/> {cart.ticketType} Ticket (x{cart.quantity})</span>
                <span className="text-black font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-500">Platform Fee (5%)</span>
                <span className="text-gray-600">{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Taxes (GST 18%)</span>
                <span className="text-gray-600">{formatCurrency(tax)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg text-black font-medium">Total Payable</span>
              <span className="text-3xl font-black text-black">
                {formatCurrency(finalTotal)}
              </span>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-lg" 
              onClick={handlePayment} 
              isLoading={isProcessing}
            >
              Pay {formatCurrency(finalTotal)} Securely
            </Button>
            <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-500 font-medium">
              <Lock size={12} /> Secure 256-bit SSL Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
