'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type Event } from '@/lib/data';
import { GlassCard } from '../ui/GlassCard';

export function EventCard({ event, compact = false }: { event: Event; compact?: boolean }) {
  return (
    <GlassCard padding="none" glowOnHover className="flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d20] to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span 
            className="badge" 
            style={{ 
              background: `${event.categoryColor}20`, // 20% opacity hex
              border: `1px solid ${event.categoryColor}50`,
              color: event.categoryColor 
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Hot / Featured Badge */}
        {event.isHot && (
          <div className="absolute top-4 right-4 z-10">
            <span className="badge badge-red flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              HOT
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center text-sm text-slate-300">
            <Calendar size={16} className="mr-2 text-primary-light" />
            {formatDate(event.date)}
          </div>
          {!compact && (
            <div className="flex items-center text-sm text-slate-300">
              <Clock size={16} className="mr-2 text-cyan-400" />
              {event.time}
            </div>
          )}
          <div className="flex items-center text-sm text-slate-300">
            <MapPin size={16} className="mr-2 text-red-400" />
            {event.city}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Starts from</span>
            <span className="text-lg font-bold text-white">{formatCurrency(event.price)}</span>
          </div>
          
          <Link href={`/events/${event.id}`} className="btn-glass px-4 py-2 text-sm !rounded-full group-hover:bg-purple-600/30 group-hover:border-purple-500/50">
            Book <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
