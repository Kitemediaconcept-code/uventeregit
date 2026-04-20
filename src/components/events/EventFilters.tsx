'use client';

import { Search, MapPin, Calendar, Tag, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { GlassPanel } from '../ui/GlassCard';
import { Button } from '../ui/Button';

export interface FilterState {
  search: string;
  category: string;
  city: string;
  date: string;
  priceRange: string;
}

interface EventFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onClear: () => void;
}

export function EventFilters({ filters, setFilters, onClear }: EventFiltersProps) {
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <GlassPanel className="p-6 sticky top-24 border-r-0 border-l-0 sm:border-r sm:border-l sm:rounded-[32px] sm:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-red-400" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Search Events</label>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Keyword..." 
              className="input-glass w-full pl-10 h-11 text-sm bg-black/20"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Category Setup */}
        <div>
          <label className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Tag size={14} /> Categories
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.category === '' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5`}
                style={{
                  background: filters.category === category.id ? category.color : 'rgba(255,255,255,0.05)',
                  color: filters.category === category.id ? '#000' : 'rgb(203, 213, 225)',
                  boxShadow: filters.category === category.id ? `0 4px 12px ${category.color}40` : 'none',
                }}
              >
                <span>{category.icon}</span> {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* City Filter */}
        <div>
           <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <MapPin size={14} /> Location
          </label>
          <select 
            className="select-glass w-full h-11 text-sm bg-black/20"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Goa">Goa</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Calendar size={14} /> Date
          </label>
          <div className="relative">
            <input 
              type="date" 
              className="input-glass w-full h-11 text-sm bg-black/20 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert pr-4"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Max Price</label>
          <select 
            className="select-glass w-full h-11 text-sm bg-black/20"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          >
            <option value="">Any Price</option>
            <option value="1000">Under ₹1,000</option>
            <option value="2500">Under ₹2,500</option>
            <option value="5000">Under ₹5,000</option>
            <option value="10000">Under ₹10,000</option>
          </select>
        </div>

      </div>
    </GlassPanel>
  );
}
