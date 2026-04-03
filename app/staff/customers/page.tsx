"use client";
import { useState, useEffect } from 'react';
import { Plus, Users, Search, MapPin, Phone, Building2, ChevronRight, X } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    address: '', phone: '', account_id: '', permit_numbers: '',
    registered_company_name: '', dba: '', email: '', sales_tax_id: '',
    has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowModal(false);
        setFormData({
          address: '', phone: '', account_id: '', permit_numbers: '',
          registered_company_name: '', dba: '', email: '', sales_tax_id: '',
          has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error registering customer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-24 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-50 border-t-emerald-600 rounded-full animate-spin" />
            <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none text-center">Syncing Retailer Network Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Strategic Customer Map</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Directory of active retailer accounts and procurement entities.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Register New Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-lg bg-slate-50/50">ID: {customer.account_id}</span>
            </div>

            <div className="space-y-1 mb-6 relative z-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter truncate group-hover:text-emerald-700 transition-colors uppercase">{customer.dba || 'Unnamed Retailer'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide truncate">{customer.registered_company_name || 'No Registered Entity'}</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-50 relative z-10">
                <div className="flex items-center gap-3 text-slate-500">
                    <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">{customer.phone || 'NO CONTACT'}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-500">
                    <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold leading-relaxed line-clamp-2">{customer.address || 'LOCATIO UNAVAILABLE'}</span>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between relative z-10">
                <span className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{customer.payment_type || 'COD'} TERMS</span>
                <button className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                    View Portfolio <ChevronRight className="w-3 h-3" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Onboard New Retailer</h2>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Expanding Strategic Distribution Network</p>
              </div>
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-10 py-8 space-y-8 flex-1 overflow-y-auto font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Institutional Matrix</h3>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-center md:text-left">Legal Entity Name</label>
                        <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 rounded-2xl transition text-sm font-bold placeholder:font-normal outline-none"
                            value={formData.registered_company_name} onChange={e => setFormData({ ...formData, registered_company_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-center md:text-left">DBA (Commercial Front)</label>
                        <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 rounded-2xl transition text-sm font-bold placeholder:font-normal outline-none"
                            value={formData.dba} onChange={e => setFormData({ ...formData, dba: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Contact Protocols</h3>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-center md:text-left">Secure Phone Line</label>
                        <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 rounded-2xl transition text-sm font-bold placeholder:font-normal outline-none"
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-center md:text-left">Institutional Email</label>
                        <input type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 rounded-2xl transition text-sm font-bold placeholder:font-normal outline-none"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Geographical Deployment Point (Full Address)</label>
                <textarea required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 rounded-2xl transition resize-none h-24 text-sm font-bold placeholder:font-normal outline-none"
                  value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition">Discard</button>
                <button type="submit" disabled={submitting} className="px-10 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition disabled:opacity-50">
                  {submitting ? 'Encrypting Data...' : 'Finalize Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
