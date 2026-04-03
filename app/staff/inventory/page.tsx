"use client";
import { useState, useEffect } from 'react';
import { Package, Search, AlertTriangle, CheckCircle2, History, RefreshCw } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token?.split('.')[1] || ""));
      setUserId(payload.id);

      const [invRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/inventory/logs`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const invData = await invRes.json();
      const logsData = await logsRes.json();

      if (invData.success) {
        // Filter current staff member's sub-inventory
        const staffInventory = invData.data.map((item: any) => {
            const sub = item.sub_inventories?.find((s: any) => s.user_id == payload.id);
            return {
                ...item,
                my_quantity: sub?.quantity || 0
            };
        });
        setInventory(staffInventory);
      }
      
      if (logsData.success) {
          // Filter logs for this staff (though backend might already filter, let's be sure)
          const staffLogs = logsData.data.filter((l: any) => l.salesperson_id == payload.id || l.user_id == payload.id);
          setLogs(staffLogs);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-24 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none">Syncing Local Stock Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Inventory Hub</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Real-time stock tracking for your assigned region.</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Current Status
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Transfer History
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-indigo-600 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total SKU Variants</p>
              <h2 className="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">{inventory.filter(i => i.my_quantity > 0).length}</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-600 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Total Units</p>
              <h2 className="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">{inventory.reduce((acc, i) => acc + i.my_quantity, 0)}</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Low Stock Alerts</p>
              <h2 className="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">
                  {inventory.filter(i => i.my_quantity > 0 && i.my_quantity <= 5).length}
              </h2>
          </div>
      </div>

      {activeTab === 'status' ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/30">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Filter through my products..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold placeholder:font-normal focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Product Description</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">My Stock</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">In Warehouse</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.filter(i => i.my_quantity > 0).map(item => (
                  <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight text-base">{item.item_name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.category_name || 'NO CATEGORY'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-xl font-black ${item.my_quantity <= 5 ? 'text-rose-600' : 'text-indigo-600'}`}>{item.my_quantity}</span>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-400">
                      {item.warehouse_quantity || 0}
                    </td>
                    <td className="px-8 py-5">
                      {item.my_quantity <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-100 uppercase tracking-widest">
                          <AlertTriangle className="w-3 h-3" /> Urgent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Sufficient
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {inventory.filter(i => i.my_quantity > 0).length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-32 text-center flex flex-col items-center justify-center space-y-4">
                        <Package className="w-12 h-12 text-slate-200" />
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Assigned Stock</h3>
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-wide">Contact your administrator to refill units.</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Δ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-xs font-mono font-bold text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{log.item_name}</span>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 ${log.type === 'SALE' ? 'text-indigo-500' : 'text-emerald-500'}`}>{log.type}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-5 text-center font-black text-lg ${log.quantity_changed > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-bold uppercase tracking-wide truncate max-w-md">
                      {log.notes || '— System Auto Log —'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
