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
          <p className="text-slate-500 mt-1 font-medium text-sm">Aggregated data insights and performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2 bg-indigo-50 w-fit rounded-lg mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">MTD Revenue</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            ${sales.reduce((acc, s) => acc + parseFloat(s.total_revenue), 0).toLocaleString()}
          </h2>
          <p className="text-[10px] text-indigo-600 font-black mt-2 flex items-center gap-1 uppercase tracking-wider">
            +12.4% <span className="text-slate-400 font-bold tracking-tight">vs last month</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2 bg-emerald-50 w-fit rounded-lg mb-4">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {sales.reduce((acc, s) => acc + parseInt(s.total_orders), 0)}
          </h2>
          <p className="text-[10px] text-emerald-600 font-black mt-2 flex items-center gap-1 uppercase tracking-wider">
            Active <span className="text-slate-400 font-bold tracking-tight text-[9px]">distribution cycles</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2 bg-rose-50 w-fit rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Stock Alerts</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{alerts.length}</h2>
          <p className="text-[10px] text-rose-600 font-black mt-2 uppercase tracking-wider">Critical <span className="text-slate-400 font-bold tracking-tight">restock required</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2 bg-amber-50 w-fit rounded-lg mb-4">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Active Customers</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{topCustomers.length}</h2>
          <p className="text-[10px] text-amber-600 font-black mt-2 uppercase tracking-wider">Retained <span className="text-slate-400 font-bold tracking-tight">customer base</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Sales Performance
            </h3>
            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded border border-indigo-100 uppercase tracking-widest">Last 30 Days</span>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {sales.map((day, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 w-16 uppercase tracking-wider">{new Date(day.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                  <div className="flex-1 bg-slate-50 h-2.5 rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${(parseFloat(day.total_revenue) / 5000) * 100}%`, maxWidth: '100%' }} 
                    />
                  </div>
                  <span className="text-[11px] font-black text-slate-900 w-20 text-right tracking-tight">${parseFloat(day.total_revenue).toLocaleString()}</span>
                </div>
              ))}
              {sales.length === 0 && <p className="text-center text-slate-400 py-10 text-[11px] font-bold uppercase tracking-widest italic">No sales data found for the current period.</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-[11px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Users className="w-4 h-4 text-amber-600" /> Top Performing Customers
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {topCustomers.map((cust, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer group border border-transparent hover:border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-amber-600 font-black text-[11px]">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-xs">{cust.customer_name}</h4>
                      <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">ID: {cust.account_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">${parseFloat(cust.total_spent).toLocaleString()}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{cust.order_count} TRXS</p>
                  </div>
                </div>
              ))}
              {topCustomers.length === 0 && <p className="text-center text-slate-400 py-10 text-[11px] font-bold uppercase tracking-widest italic">No data from active distribution yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
