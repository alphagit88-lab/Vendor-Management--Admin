"use client";

import { useEffect, useState } from 'react';
import { Users, Store, Package, Activity, ArrowUpRight, TrendingUp, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({ 
    users: { value: 0, change: '0%' }, 
    shops: { value: 0, change: '0%' }, 
    items: { value: 0, change: '0%' }, 
    orders: { value: 0, change: '0%' } 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Active Staff', value: stats.users.value, icon: Users, change: stats.users.change, color: 'from-blue-500 to-indigo-600', bg: 'bg-indigo-50/50' },
    { name: 'Registered Shops', value: stats.shops.value, icon: Store, change: stats.shops.change, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50/50' },
    { name: 'Available Items', value: stats.items.value, icon: Package, change: stats.items.change, color: 'from-amber-400 to-orange-500', bg: 'bg-orange-50/50' },
    { name: 'Total Orders', value: stats.orders.value, icon: ShoppingCart, change: stats.orders.change, color: 'from-fuchsia-400 to-purple-600', bg: 'bg-fuchsia-50/50' },
  ];

  if (loading && stats.users.value === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto space-y-12">
        <div className="flex justify-between items-center gap-6">
          <div className="space-y-3">
            <div className="h-10 w-72 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-56 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-pulse flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl" />
                <div className="w-16 h-6 bg-emerald-50 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-50 rounded-full" />
                <div className="h-10 w-32 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
              <LayoutDashboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Initializing Overview Matrix</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Compiling real-time system metrics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-full -z-10`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-slate-700`} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
        </div>
        <div className="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <Activity className="w-10 h-10 text-slate-300 mb-4" />
          <h3 className="text-sm font-semibold text-slate-900">No recent activities</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">Activity logs will appear here when users or shops are added to the system.</p>
        </div>
      </div>
    </div>
  );
}
