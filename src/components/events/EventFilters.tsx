'use client';

import { Search, MapPin, Calendar, Tag, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
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
    <div className="p-8 sticky top-28 border sm:rounded-[32px] border-gray-200 bg-zinc-50 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2 text-black">
          <SlidersHorizontal size={20} className="text-[#07715F]" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={onClear}
            className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <X size={16} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Search Events</label>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Keyword..." 
              className="w-full pl-12 h-12 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-[#51C67E] transition-colors text-black"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Category Setup */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Tag size={16} /> Categories
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                filters.category === '' 
                  ? 'bg-[#07715F] text-white border-[#07715F]' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => {
              const isActive = filters.category === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.id)}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border`}
                  style={{
                    background: isActive ? category.color : '#ffffff',
                    color: isActive ? '#ffffff' : '#64748b',
                    borderColor: isActive ? category.color : '#e2e8f0',
                  }}
                >
                  <span className="opacity-80">{category.icon}</span> {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Filter */}
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <MapPin size={16} /> Location
          </label>
          <select 
            className="w-full h-12 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-[#51C67E] px-4 cursor-pointer text-black"
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
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Calendar size={16} /> Date
          </label>
          <div className="relative">
            <input 
              type="date" 
              className="w-full h-12 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-[#51C67E] px-4 cursor-pointer text-black"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Max Price</label>
          <select 
            className="w-full h-12 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-[#51C67E] px-4 cursor-pointer text-black"
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
    </div>
  );
}
