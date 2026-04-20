'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EVENTS } from '@/lib/data';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters, FilterState } from '@/components/events/EventFilters';
import { GlassCard } from '@/components/ui/GlassCard';
import { TicketX } from 'lucide-react';

function EventsPageContent() {
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    city: '',
    date: '',
    priceRange: '',
  });

  // Read URL params initially
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    
    if (categoryQuery || searchQuery) {
      setFilters(prev => ({
        ...prev,
        category: categoryQuery || prev.category,
        search: searchQuery || prev.search
      }));
    }
  }, [searchParams]);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return EVENTS.filter(event => {
      // Search
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) 
          && !event.city.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Category
      if (filters.category && event.category !== filters.category) {
        return false;
      }
      // City
      if (filters.city && event.city !== filters.city) {
        return false;
      }
      // Date (exact match for simplicity, can be extended to range)
      if (filters.date) {
        // Simple comparison assuming event.date is parsable and we just want same month/year or exact day
        const eventD = new Date(event.date).toISOString().split('T')[0];
        if (eventD !== filters.date) return false;
      }
      // Price
      if (filters.priceRange) {
        if (event.price > parseInt(filters.priceRange)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      date: '',
      priceRange: '',
    });
  };

  return (
    <div className="container py-8 relative min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Explore <span className="text-gradient">Events</span></h1>
        <p className="text-slate-400">Discover handpicked premium events happening around you.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-[320px] shrink-0 z-10">
          <EventFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters}
          />
        </div>

        {/* Results Grid */}
        <div className="flex-1 w-full">
          {/* Active filter pills could go here */}
          <div className="mb-6 flex justify-between items-center text-sm text-slate-400">
            <span>Showing {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}</span>
            {/* Sort Dropdown placeholder */}
            <select className="bg-transparent border-none text-slate-300 outline-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <GlassCard padding="lg" className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-500">
                <TicketX size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-slate-400 max-w-sm mb-6">
                We couldn't find any events matching your current filters. Try adjusting your search criteria.
              </p>
              <button onClick={handleClearFilters} className="btn-outline">
                Clear Filters
              </button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="container py-8 text-center text-white">Loading Filters...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}
