"use client";
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, Calendar, Download, Filter, ChevronRight, PieChart, AlertTriangle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, topRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/reports/sales`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/reports/top-customers`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/reports/inventory-alerts`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      const salesData = await salesRes.json();
      const topData = await topRes.json();
      const alertsData = await alertsRes.json();

      if (salesData.success) setSales(salesData.data);
      if (topData.success) setTopCustomers(topData.data);
      if (alertsData.success) setAlerts(alertsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 mt-1 font-medium">Aggregated data insights and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
            <Filter className="w-4 h-4" /> Custom Range
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-indigo-50 w-fit rounded-2xl mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">MTD Revenue</p>
          <h2 className="text-3xl font-extrabold text-slate-900">
            ${sales.reduce((acc, s) => acc + parseFloat(s.total_revenue), 0).toLocaleString()}
          </h2>
          <p className="text-xs text-indigo-600 font-bold mt-2 flex items-center gap-1">
            +12.4% <span className="text-slate-400 font-medium">vs last month</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-emerald-50 w-fit rounded-2xl mb-4">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {sales.reduce((acc, s) => acc + parseInt(s.total_orders), 0)}
          </h2>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            Active <span className="text-slate-400 font-medium text-[10px] tracking-tight">distribution cycles</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-rose-50 w-fit rounded-2xl mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Alerts</p>
          <h2 className="text-3xl font-extrabold text-slate-900">{alerts.length}</h2>
          <p className="text-xs text-rose-600 font-bold mt-2">Critical <span className="text-slate-400 font-medium">restock required</span></p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-amber-50 w-fit rounded-2xl mb-4">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Customers</p>
          <h2 className="text-3xl font-extrabold text-slate-900">{topCustomers.length}</h2>
          <p className="text-xs text-amber-600 font-bold mt-2">Retained <span className="text-slate-400 font-medium">customer base</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Sales Performance
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Last 30 Days</span>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {sales.map((day, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-16 uppercase">{new Date(day.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                  <div className="flex-1 bg-slate-50 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${(parseFloat(day.total_revenue) / 5000) * 100}%`, maxWidth: '100%' }} 
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 w-20 text-right">${parseFloat(day.total_revenue).toLocaleString()}</span>
                </div>
              ))}
              {sales.length === 0 && <p className="text-center text-slate-400 py-10 italic">No sales data found for the current period.</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" /> Top Performing Customers
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {topCustomers.map((cust, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600 font-black text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{cust.customer_name}</h4>
                      <p className="text-[10px] font-bold text-slate-400">Account: {cust.account_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">${parseFloat(cust.total_spent).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cust.order_count} Orders</p>
                  </div>
                </div>
              ))}
              {topCustomers.length === 0 && <p className="text-center text-slate-400 py-10 italic">No data from active distribution yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
