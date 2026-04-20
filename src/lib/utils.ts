import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export function getAvailabilityPercent(booked: number, capacity: number): number {
  return Math.round((booked / capacity) * 100);
}

export function getAvailabilityLabel(booked: number, capacity: number): { label: string; color: string } {
  const pct = getAvailabilityPercent(booked, capacity);
  if (pct >= 95) return { label: 'Sold Out', color: '#ef4444' };
  if (pct >= 80) return { label: 'Almost Full', color: '#f59e0b' };
  if (pct >= 50) return { label: 'Filling Fast', color: '#f97316' };
  return { label: 'Available', color: '#10b981' };
}

export function generateBookingRef(): string {
  return 'UVE' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventImage: string;
  ticketType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
  paymentMethod: string;
}

export function getBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('uventere_bookings') || '[]');
  } catch { return []; }
}

export function saveBooking(booking: BookingRecord): void {
  if (typeof window === 'undefined') return;
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem('uventere_bookings', JSON.stringify(bookings));
}

export function cancelBooking(bookingId: string): void {
  if (typeof window === 'undefined') return;
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = 'cancelled';
    localStorage.setItem('uventere_bookings', JSON.stringify(bookings));
  }
}

export interface CartItem {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventImage: string;
  ticketType: string;
  quantity: number;
  unitPrice: number;
}

export function getCart(): CartItem | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(sessionStorage.getItem('uventere_cart') || 'null');
  } catch { return null; }
}

export function setCart(item: CartItem): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('uventere_cart', JSON.stringify(item));
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('uventere_cart');
}

export function getSavedEvents(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('uventere_saved') || '[]');
  } catch { return []; }
}

export function toggleSavedEvent(eventId: string): boolean {
  const saved = getSavedEvents();
  const idx = saved.indexOf(eventId);
  if (idx !== -1) {
    saved.splice(idx, 1);
    localStorage.setItem('uventere_saved', JSON.stringify(saved));
    return false;
  } else {
    saved.push(eventId);
    localStorage.setItem('uventere_saved', JSON.stringify(saved));
    return true;
  }
}
