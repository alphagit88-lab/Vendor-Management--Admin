"use client";

import { useEffect, useState } from 'react';
import { Users, Store, Package, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, shops: 0, items: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch these from /api/stats
    setTimeout(() => {
      setStats({ users: 12, shops: 24, items: 156 });
      setLoading(false);
    }, 600);
  }, []);

  const statCards = [
    { name: 'Active Staff', value: stats.users, icon: Users, change: '+12%', color: 'from-blue-500 to-indigo-600', bg: 'bg-indigo-50/50' },
    { name: 'Registered Shops', value: stats.shops, icon: Store, change: '+4.5%', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50/50' },
    { name: 'Available Items', value: stats.items, icon: Package, change: '+23.1%', color: 'from-amber-400 to-orange-500', bg: 'bg-orange-50/50' },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {loading ? (
                <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value.toLocaleString()}
                </p>
              )}
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
