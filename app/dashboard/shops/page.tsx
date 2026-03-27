"use client";
import { useState, useEffect } from 'react';
import { Plus, Store, Search, MoreVertical, X, MapPin, Phone } from 'lucide-react';

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const fetchShops = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/shops', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setShops(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        fetchShops();
        setShowModal(false);
        setFormData({ name: '', address: '', contact: '' });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error adding shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Active Shops</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure network branches & locations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 shadow-sm shadow-emerald-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Onboard Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-slate-900">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 text-emerald-600 ring-2 ring-emerald-50">
                <Store className="w-6 h-6" strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{s.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-5 uppercase tracking-wider">Branch ID #{s.id.toString().padStart(4, '0')}</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-slate-600 leading-snug">{s.address}</p>
                </div>
                {s.contact && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-sm font-medium text-slate-600">{s.contact}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Onboarded {new Date(s.created_at).toLocaleDateString()}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Active" />
            </div>
          </div>
        ))}
      </div>

      {shops.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center flex flex-col items-center shadow-sm">
          <Store className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No active branches</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Scale your business by onboarding new retail or branch locations.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="mt-6 text-emerald-600 font-semibold hover:underline"
          >
            Create first branch
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configure New Branch</h2>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Branch Classification Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="e.g. Downtown Central" required
                    value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Physical Location</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition resize-none h-28" placeholder="Enter complete physical address..." required
                    value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Direct Terminal Line (Contact)</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="(555) 123-4567" 
                    value={formData.contact} onChange={e=>setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-gray-50 transition">Dismiss</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition disabled:opacity-50">
                  {loading ? 'Committing...' : 'Commit Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
