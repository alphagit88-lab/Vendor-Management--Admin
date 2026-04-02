"use client";
import { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, History, AlertTriangle, CheckCircle2, MoreHorizontal, PlusCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [loading, setLoading] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustType, setAdjustType] = useState('RESTOCK');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustUnitCost, setAdjustUnitCost] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, logsRes, custRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/inventory/logs`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/customers`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);
      const invData = await invRes.json();
      const logsData = await logsRes.json();
      const custData = await custRes.json();
      const usersData = await usersRes.json();
      
      if (invData.success) setInventory(invData.data);
      if (logsData.success) setLogs(logsData.data);
      if (custData.success) setCustomers(custData.data);
      if (usersData.success) setUsers(usersData.data);
    } catch (err) {
      console.error(err);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
    } catch (err) {
      alert("Error adjusting inventory");
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/inventory/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: -adjustAmount, // Assignment always reduces warehouse stock
          type: 'ASSIGNMENT',
          notes: `Assigned to Sales Person. Customer Reference: ${selectedCustomer}. Notes: ${adjustNotes}`,
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
        setSelectedCustomer('');
        setSelectedSalesperson('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error assigning inventory");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 pt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Control</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor stock levels and track material movements.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <Link 
            href="/dashboard/inventory/add"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-100 w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Stock
          </Link>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('status')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Live Status
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Transaction Log
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'status' ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Unique Items</p>
              <h2 className="text-4xl font-extrabold text-slate-900">{inventory.length}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
              <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">Low Stock Alerts</p>
              <h2 className="text-4xl font-extrabold text-slate-900">
                {inventory.filter(i => (i.total_quantity || 0) <= (i.reorder_level || 0)).length}
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-400">
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Total Units in Stock</p>
              <h2 className="text-4xl font-extrabold text-slate-900">
                {inventory.reduce((acc, i) => acc + (i.total_quantity || 0), 0)}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search items by name or SKU..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Warehouse</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Sales Force</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total available</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inventory.map(item => {
                    const isLow = (item.quantity || 0) <= (item.reorder_level || 0);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{item.item_name}</span>
                            <span className="text-xs text-slate-400 font-mono tracking-tighter uppercase">{item.item_number || 'NO-SKU'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-slate-600">{item.warehouse_quantity || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-amber-600 italic">+{item.salesperson_quantity || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-lg font-black ${(item.total_quantity || 0) <= (item.reorder_level || 0) ? 'text-rose-500' : 'text-slate-900'}`}>
                            {item.total_quantity || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {(item.total_quantity || 0) <= (item.reorder_level || 0) ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-100 uppercase tracking-wider">
                              <AlertTriangle className="w-3 h-3" /> RESTOCK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> OK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => { setSelectedItem(item); setShowAssignModal(true); }}
                              className="text-emerald-600 font-bold text-sm hover:underline"
                            >
                              Assign
                            </button>
                            <button 
                              onClick={() => { setSelectedItem(item); setShowAdjustModal(true); }}
                              className="text-indigo-600 font-bold text-sm hover:underline"
                            >
                              Adjust
                            </button>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Unit Cost</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Reference / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {log.item_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        log.type === 'RESTOCK' ? 'bg-emerald-100 text-emerald-800' : 
                        log.type === 'SALE' ? 'bg-indigo-100 text-indigo-800' : 
                        log.type === 'ASSIGNMENT' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center font-black ${log.quantity_changed > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-600">
                      {log.unit_cost > 0 ? `$${parseFloat(log.unit_cost).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                      {log.notes || 'No reference'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAssignModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleAssign} className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Package className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Assign Inventory</h2>
              </div>
              <p className="text-slate-500 mb-8 text-sm font-medium">Moving stock for: <span className="text-emerald-600 font-bold">{selectedItem.item_name}</span></p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Assign to Person</label>
                    <select 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold appearance-none transition-all cursor-pointer"
                      value={selectedSalesperson}
                      onChange={e => setSelectedSalesperson(e.target.value)}
                    >
                      <option value="">-- Select Person --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Customer Ref</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold appearance-none transition-all cursor-pointer"
                      value={selectedCustomer}
                      onChange={e => setSelectedCustomer(e.target.value)}
                    >
                      <option value="">-- Optional --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.dba || c.registered_company_name}>{c.dba || c.registered_company_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Quantity to Assign</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max={selectedItem.warehouse_quantity || 0}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold text-slate-900"
                    placeholder="0"
                    value={adjustAmount || ''}
                    onChange={e => setAdjustAmount(e.target.value ? parseInt(e.target.value) : 0)}
                  />
                  <p className="mt-2 text-[10px] font-bold text-slate-400 flex justify-between">
                    <span>In Warehouse: {selectedItem.warehouse_quantity || 0}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Internal Notes</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 resize-none h-24 text-sm font-medium outline-none"
                    placeholder="Reference order numbers, project details, or site names..."
                    value={adjustNotes}
                    onChange={e => setAdjustNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={!adjustAmount || adjustAmount > (selectedItem.quantity || 0)}
                  className="flex-[2] py-3 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAdjustModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleAdjust} className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Adjust Inventory</h2>
              <p className="text-slate-500 mb-8 text-sm">Adjusting stock for: <span className="font-bold text-slate-800">{selectedItem.item_name}</span></p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Adjustment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setAdjustType('RESTOCK')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${adjustType === 'RESTOCK' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-slate-400'}`}
                    >
                      <Plus className="w-4 h-4" /> Add Stock
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAdjustType('ADJUSTMENT')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${adjustType === 'ADJUSTMENT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-slate-400'}`}
                    >
                      <Minus className="w-4 h-4" /> Remove Stock
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                    value={adjustAmount || ''}
                    onChange={e => setAdjustAmount(e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </div>

                {adjustType === 'RESTOCK' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Unit Cost ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xl font-bold"
                      value={adjustUnitCost}
                      onChange={e => setAdjustUnitCost(parseFloat(e.target.value))}
                    />
                  </div>
                )}


                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Notes / Reason</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white resize-none h-24 text-sm"
                    placeholder="e.g. Weekly restock from vendor A..."
                    value={adjustNotes}
                    onChange={e => setAdjustNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button type="button" onClick={() => setShowAdjustModal(false)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition">Discard</button>
                <button type="submit" className="flex-[2] py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">Update Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
