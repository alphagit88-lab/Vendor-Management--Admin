"use client";
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Filter, Clock, CheckCircle2, ChevronRight, UserCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  if (loading) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-24 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none text-center">Reconstructing Sales Pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Sales Orders</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Tracking your regional revenue generation streams.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            {['all', 'pending', 'completed'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search my orders..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Net Revenue</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Matrix</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="font-mono text-sm font-black text-indigo-600 tracking-tighter">{order.order_number}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm">{order.customer_name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account ID: {order.account_id || 'NO-REF'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-base font-black text-slate-900">${parseFloat(order.total_amount).toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    {order.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase tracking-widest shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Finalized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-100 uppercase tracking-widest shadow-sm">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 bg-slate-50 group-hover:bg-white rounded-xl border border-transparent group-hover:border-slate-100 shadow-sm transition-all">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <ShoppingCart className="w-12 h-12 text-slate-200" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No matching orders found</h3>
                                <p className="text-sm font-bold text-slate-300 uppercase tracking-wide">Adjust your filter parameters or initiate a new sale.</p>
                            </div>
                        </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
