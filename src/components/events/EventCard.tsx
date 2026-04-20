'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type Event } from '@/lib/data';
import { GlassCard } from '../ui/GlassCard';

export function EventCard({ event, compact = false }: { event: Event; compact?: boolean }) {
  return (
    <div className="flex flex-col h-full group bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span 
            className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#0f172a' 
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Hot / Featured Badge */}
        {event.isHot && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              TOP RATED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={12} className="text-indigo-500" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{event.city}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-900">
            <span className="text-sm font-medium opacity-50">from</span>
            <span className="text-lg font-black">{formatCurrency(event.price)}</span>
          </div>
          
          <Link href={`/events/${event.id}`} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all group-hover:scale-110 shadow-lg">
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
