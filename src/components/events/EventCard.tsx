'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { type Event } from '@/lib/data';

export function EventCard({ event, compact = false }: { event: Event; compact?: boolean }) {
  return (
    <div className="flex flex-col h-full group bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#51C67E] transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span 
            className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white text-black shadow-sm" 
          >
            {event.category}
          </span>
        </div>

        {/* Hot / Featured Badge */}
        {event.isHot && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-[#07715F] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Top Rated
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={12} className="text-[#07715F]" />
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">{event.city}</span>
        </div>
        
        <h3 className="text-xl font-bold text-black mb-6 group-hover:text-[#07715F] transition-colors leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-black">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">from</span>
            <span className="text-xl font-black">{formatCurrency(event.price)}</span>
          </div>
          
          <Link href={`/events/${event.id}`} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-[#07715F] transition-all group-hover:scale-110 shadow-sm">
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
