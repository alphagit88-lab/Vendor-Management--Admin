"use client";
import { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, History, AlertTriangle, CheckCircle2, MoreHorizontal, PlusCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustType, setAdjustType] = useState('RESTOCK');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustUnitCost, setAdjustUnitCost] = useState(0);
  const [selectedSalesperson, setSelectedSalesperson] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubInventory, setSelectedSubInventory] = useState('ALL_STOCK');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const [invRes, logsRes, custRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/inventory/logs`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/customers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const invData = await invRes.json();
      const logsData = await logsRes.json();
      const custData = await custRes.json();
      const usersData = await usersRes.json();

      if (invData.success) setInventory(invData.data);
      if (logsData.success) setLogs(logsData.data);
      if (custData.success) setCustomers(custData.data);
      if (usersData.success) setUsers(usersData.data);

    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Connection lost. Retrying backend synchronization...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: adjustType === 'RESTOCK' ? adjustAmount : -adjustAmount,
          type: adjustType,
          notes: adjustNotes,
          unit_cost: adjustType === 'RESTOCK' ? adjustUnitCost : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setShowAdjustModal(false);
        setAdjustAmount(0);
        setAdjustNotes('');
        setAdjustUnitCost(0);
      } else {
        alert(data.message);
      }
    } catch (err) { alert("Error adjusting inventory"); }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: -adjustAmount,
          type: 'ASSIGNMENT',
          notes: `Assigned to: ${users.find(u => u.id == selectedSalesperson)?.name || 'Direct Assign'}. Notes: ${adjustNotes}`,
          unit_cost: 0,
          salesperson_id: selectedSalesperson
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setShowAssignModal(false);
        setAdjustAmount(0);
        setAdjustNotes('');
        setSelectedSalesperson('');
      } else { alert(data.message); }
    } catch (err) { alert("Error assigning inventory"); }
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden text-center p-24">
            <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Syncing Logistical Data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 pt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Control</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Monitor stock levels and track material movements.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <Link
            href="/dashboard/inventory/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-black shadow-lg shadow-indigo-100 h-fit hover:bg-indigo-700 transition-all w-full sm:w-auto justify-center uppercase text-[11px] tracking-widest"
          >
            <PlusCircle className="w-4 h-4" /> Add New Stock
          </Link>

          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-100 h-fit">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Status
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Log
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm h-fit relative">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none px-2 pr-0">Sub-Inventory</span>
              <div className="relative flex items-center">
                <select 
                  value={selectedSubInventory}
                  onChange={(e) => setSelectedSubInventory(e.target.value)}
                  className="bg-transparent text-slate-800 font-bold text-xs py-1.5 pl-2 pr-8 outline-none cursor-pointer appearance-none"
                >
                  <option value="ALL_STOCK">🌍 Global Total</option>
                  <option value="WAREHOUSE">🏢 Main Warehouse</option>
                  {users.filter(u => u.role === 'staff').map(u => (
                    <option key={u.id} value={`SP_${u.id}`}>📍 {u.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>
          </div>
        </div>
      </div>

      {activeTab === 'status' ? (
        <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unique Items</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{inventory.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-amber-400">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Low Stock Alerts</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                        {inventory.filter(i => (i.total_quantity || 0) <= (i.reorder_level || 0)).length}
                    </h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-emerald-400">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total On-Hand</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                        {inventory.reduce((acc, i) => Number(acc) + Number(i.total_quantity || 0), 0).toLocaleString()}
                    </h2>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Warehouse</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Staff Force</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inventory.map(item => {
                                let staffStock = 0;
                                let warehouseStock = Number(item.warehouse_quantity || 0);

                                if (selectedSubInventory === 'ALL_STOCK') {
                                    staffStock = Number(item.salesperson_quantity || 0);
                                } else if (selectedSubInventory === 'WAREHOUSE') {
                                    staffStock = 0;
                                } else if (selectedSubInventory.startsWith('SP_')) {
                                    const spId = selectedSubInventory.split('_')[1];
                                    const subs = Array.isArray(item.sub_inventories) ? item.sub_inventories : [];
                                    const spData = subs.find((s: any) => s.user_id?.toString() === spId);
                                    staffStock = Number(spData?.quantity || 0);
                                }

                                const rowTotal = warehouseStock + staffStock;

                                return (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-800 text-sm tracking-tight">{item.item_name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight uppercase">{item.item_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-600">{warehouseStock}</td>
                                        <td className="px-6 py-4 text-center font-bold text-amber-600">+{staffStock}</td>
                                        <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{rowTotal}</td>
                                        <td className="px-6 py-4">
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                                                rowTotal <= (item.reorder_level || 0) ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            }`}>
                                                {rowTotal <= (item.reorder_level || 0) ? 'RESTOCK' : 'OK'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setSelectedItem(item); setShowAssignModal(true); }} className="text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50 transition-colors">Move</button>
                                                <button onClick={() => { setSelectedItem(item); setShowAdjustModal(true); }} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition-colors">Adjust</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
        /* History Log View */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Qty Change</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-xs font-mono text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                                <td className="px-6 py-4 font-black text-slate-800 text-sm">{log.item_name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                                        log.type === 'ASSIGNMENT' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        log.type === 'RESTOCK' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        'bg-indigo-50 text-indigo-700 border-indigo-100'
                                    }`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-center font-black ${log.quantity_changed > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500 font-bold italic truncate max-w-xs">{log.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Modals... Adjusted for consistency */}
      {showAssignModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Assign Stock</h2>
              </div>
              
              <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Staff</label>
                    <select
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer appearance-none"
                        value={selectedSalesperson}
                        onChange={e => setSelectedSalesperson(e.target.value)}
                    >
                        <option value="">Choose staff...</option>
                        {users.filter(u => u.role === 'staff').map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount to Transfer</label>
                    <input
                        type="number"
                        required
                        min="1"
                        max={selectedItem.warehouse_quantity || 0}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-2xl font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-600/10"
                        placeholder="0"
                        value={adjustAmount || ''}
                        onChange={e => setAdjustAmount(parseInt(e.target.value) || 0)}
                    />
                  </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-2.5 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-lg transition">Cancel</button>
                <button
                  type="submit"
                  onClick={handleAssign}
                  className="flex-[2] py-2.5 font-black text-white bg-emerald-600 rounded-lg shadow-lg shadow-emerald-100 uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition"
                >
                  Confirm Movement
                </button>
              </div>
          </div>
        </div>
      )}

      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAdjustModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Adjust Inventory</h2>
              </div>

              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100">
                      <button onClick={() => setAdjustType('RESTOCK')} className={`py-2 rounded-md font-black text-[10px] uppercase tracking-wider transition-all ${adjustType === 'RESTOCK' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}>Restock</button>
                      <button onClick={() => setAdjustType('ADJUSTMENT')} className={`py-2 rounded-md font-black text-[10px] uppercase tracking-wider transition-all ${adjustType === 'ADJUSTMENT' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Manual</button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-2xl font-black outline-none focus:ring-1 focus:ring-indigo-600/10"
                      placeholder="0"
                      value={adjustAmount || ''}
                      onChange={e => setAdjustAmount(parseInt(e.target.value) || 0)}
                    />
                  </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button onClick={() => setShowAdjustModal(false)} className="flex-1 py-2.5 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-lg transition">Dismiss</button>
                  <button onClick={handleAdjust} className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-lg font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">Commit Update</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
