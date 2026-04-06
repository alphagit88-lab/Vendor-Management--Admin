"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Package, TrendingUp, Activity, ArrowUpRight, LayoutDashboard, Clock } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    assignedItems: 0,
    pendingDeliveries: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [ordersRes, invRes] = await Promise.all([
          fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const ordersData = await ordersRes.json();
        const invData = await invRes.json();

        if (ordersData.success) {
          const orders = ordersData.data;
          setRecentOrders(orders.slice(0, 5));
          const totalSales = orders.reduce((acc: number, o: any) => acc + parseFloat(o.total_amount), 0);
          setStats(prev => ({
            ...prev,
            totalSales,
            totalOrders: orders.length,
            pendingDeliveries: orders.filter((o: any) => o.status === 'pending').length
          }));
        }

        if (invData.success) {
            // Get user ID from token
            const payload = JSON.parse(atob(token?.split('.')[1] || ""));
            const userId = payload.id;
            
            const assignedCount = invData.data.reduce((acc: number, item: any) => {
                let subs = item.sub_inventories;
                if (typeof subs === 'string') {
                    try { subs = JSON.parse(subs); } catch(e) { subs = []; }
                }
                const sub = subs?.find((s: any) => s.user_id == userId);
                return acc + (sub?.quantity || 0);
            }, 0);
            
            setStats(prev => ({ ...prev, assignedItems: assignedCount }));
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Total Sales Revenue', value: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Total Orders Placed', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Units in My Stock', value: stats.assignedItems, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Your Performance Metrics...</p>
          </div>
      );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sales Representative Dashboard</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Real-time tracking of your regional operations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black text-emerald-600 shadow-sm uppercase tracking-widest">
          <Activity className="w-4 h-4" />
          <span>Active Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
              </div>
              <div className="bg-slate-50 p-1.5 rounded-full">
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Sales Orders</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-mono text-xs font-bold text-indigo-600">{order.order_number}</td>
                    <td className="py-4 text-sm font-bold text-slate-700">{order.customer_name}</td>
                    <td className="py-4 text-sm font-black text-slate-900">${parseFloat(order.total_amount).toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                    <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                            No sales performance data generated yet.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/20">
                        <Activity className="w-5 h-5 text-indigo-300" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest">Network Status</h2>
                </div>
                
                <div className="space-y-6 flex-1">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sync Status</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold">Cloud Nodes Synchronized</span>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Inventory Hub</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-sm font-bold">Regional Sub-Warehouse 01</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">System Version</p>
                    <p className="text-xs font-bold text-slate-300">v2.4.0-pro_enterprise</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
