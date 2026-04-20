'use client';

import { useState, useEffect } from 'react';
import { GlassCard, GlassPanel } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle2, Clock, XCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type EventRequest = {
  id: string;
  full_name: string;
  event_name: string;
  booking_person_details: string;
  description: string;
  pricing_details: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  media_url?: string;
  user_id: string;
};

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoordinatorMode, setIsCoordinatorMode] = useState(false); // Mock role toggle for demo

  useEffect(() => {
    fetchSessionAndData();
  }, [isCoordinatorMode]);

  const fetchSessionAndData = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      setUser(session.user);
      
      let query = supabase
        .from('event_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // If not acting as coordinator, only show my own requests
      if (!isCoordinatorMode) {
        query = query.eq('user_id', session.user.id);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setRequests(data as EventRequest[]);
      }
    } else {
      window.location.href = '/auth/login';
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('event_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Event marked as ${newStatus}`);
      fetchSessionAndData(); // Refresh list
    }
  };

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
          <p className="text-slate-600">Track and manage your custom event requests.</p>
        </div>
        
        {/* Toggle for Demo Coordinator Role */}
        <button 
          onClick={() => setIsCoordinatorMode(!isCoordinatorMode)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all ${isCoordinatorMode ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
        >
          <ShieldAlert size={16} /> {isCoordinatorMode ? 'Exit Coordinator Mode' : 'Enter Coordinator Mode'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard padding="sm" className="flex items-center gap-4 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-slate-500">Pending Review</div>
          </div>
        </GlassCard>
        
        <GlassCard padding="sm" className="flex items-center gap-4 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{requests.filter(r => r.status === 'approved').length}</div>
            <div className="text-sm text-slate-500">Approved Events</div>
          </div>
        </GlassCard>

        <GlassCard padding="sm" className="flex items-center gap-4 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
            <div className="text-sm text-slate-500">Total Requests</div>
          </div>
        </GlassCard>
      </div>

      <GlassPanel className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">{isCoordinatorMode ? 'ALL User Event Requests (Coordinator View)' : 'Your Event Requests'}</h2>
          {!isCoordinatorMode && (
             <Link href="/custom-event" className="btn-primary text-sm px-4 py-2">
               + Request New Event
             </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-500">Loading your data...</div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-[#f8fafc] border border-black/5 hover:border-black/10 transition-colors">
                
                {req.media_url ? (
                  <img src={req.media_url} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center border border-slate-200">
                    <Calendar className="text-slate-400" />
                  </div>
                )}

                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h4 className="font-bold text-lg text-slate-900">{req.event_name}</h4>
                    {req.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">Pending</span>}
                    {req.status === 'approved' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">Approved</span>}
                    {req.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">Rejected</span>}
                  </div>
                  <p className="text-sm text-slate-600 mb-2 max-w-2xl">{req.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-500">
                    <span><strong className="text-slate-700">Client:</strong> {req.full_name}</span>
                    <span><strong className="text-slate-700">Budget/Pricing:</strong> {req.pricing_details}</span>
                    <span><strong className="text-slate-700">Requested on:</strong> {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {isCoordinatorMode && req.status === 'pending' && (
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-center">
                    <Button variant="primary" onClick={() => handleUpdateStatus(req.id, 'approved')} className="text-sm py-2 px-6">Approve & Publish</Button>
                    <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="btn-outline text-slate-500 border-slate-300 hover:bg-slate-100 hover:text-slate-700 text-sm py-2 px-6">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#f8fafc] rounded-2xl border border-dashed border-slate-300">
            <Calendar size={40} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-500 mb-6 text-lg">No event requests found in the database.</p>
            {!isCoordinatorMode && <Link href="/custom-event" className="btn-primary">Book Your First Event</Link>}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
