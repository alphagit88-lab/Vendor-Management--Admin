"use client";
import { useState, useEffect } from 'react';
import { Package, Search, TrendingUp, AlertTriangle, CheckCircle2, History, RefreshCw } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token?.split('.')[1] || ""));
      const currentUserId = payload.id;

      const [invRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/inventory/logs`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const invData = await invRes.json();
      const logsData = await logsRes.json();

      if (invData.success) {
        const staffInventory = invData.data.map((item: any) => {
            let subs = item.sub_inventories;
            if (typeof subs === 'string') {
                try { subs = JSON.parse(subs); } catch(e) { subs = []; }
            }
            const sub = subs?.find((s: any) => s.user_id == currentUserId);
            return {
                ...item,
                my_quantity: sub?.quantity || 0,
                sub_inventories: subs
            };
        });
        setInventory(staffInventory);
      }
      
      if (logsData.success) {
          setLogs(logsData.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none text-center italic">Synchronizing Localized Stock Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto space-y-8">
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Inventory Hub</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Real-time stock levels for your assigned region.</p>
        </div>

        <div className="flex items-center gap-4">
             <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                <button
                    onClick={() => setActiveTab('status')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Current Stock
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Transfer History
                </button>
            </div>
            <button 
                onClick={fetchData}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 shadow-sm"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
      </div>

      {activeTab === 'status' ? (
        <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                { label: 'Total SKU Variants', value: inventory.filter(i => i.my_quantity > 0).length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'My Total Units', value: inventory.reduce((acc, i) => acc + i.my_quantity, 0), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Low Stock Alerts', value: inventory.filter(i => i.my_quantity > 0 && i.my_quantity < 10).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-100 transition-all cursor-default">
                    <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 ${stat.bg} rounded-2xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    </div>
                    <div>
                    <h2 className="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">{stat.value}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                </div>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search my inventory..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Qty (Global)</th>
                        <th className="px-8 py-5 text-[10px) font-black text-slate-400 uppercase tracking-widest text-center">My Stock Level</th>
                        <th className="px-8 py-5 text-[10px) font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {inventory.map(item => (
                        <tr key={item.id} className={`hover:bg-slate-50/80 transition-all group ${item.my_quantity === 0 ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                            <td className="px-8 py-5">
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-800 text-sm">{item.item_name || item.description_name}</span>
                                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{item.item_number}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="font-bold text-slate-500 text-sm whitespace-nowrap">{item.total_quantity || 0} units</span>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <span className={`text-xl font-black ${item.my_quantity > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>{item.my_quantity}</span>
                            </td>
                            <td className="px-8 py-5">
                                {item.my_quantity > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase tracking-widest shadow-sm">
                                        <Package className="w-3 h-3" /> Fully Stocked
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black border border-slate-100 uppercase tracking-widest">
                                        NO STOCK
                                    </span>
                                )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </>
      ) : (
        /* History Log View */
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty Change</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference / Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-all">
                                <td className="px-8 py-5 whitespace-nowrap text-xs font-mono text-slate-400">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-800 text-sm">{log.item_name}</span>
                                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{log.item_number}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                        log.type === 'RESTOCK' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        log.type === 'SALE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        log.type === 'ASSIGNMENT' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className={`px-8 py-5 text-center font-black ${log.quantity_changed > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-500 italic max-w-xs truncate font-bold">
                                    {log.notes || 'No reference context'}
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
