"use client";
import { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, History, AlertTriangle, CheckCircle2, MoreHorizontal, PlusCircle, RefreshCw, ChevronDown, Building, Trash2, Edit3, X, Upload } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Load modal state
  const [loadDestination, setLoadDestination] = useState('');
  const [loadCategory, setLoadCategory] = useState('All');
  const [loadQtys, setLoadQtys] = useState<Record<number, string>>({});
  const [loadSubmitting, setLoadSubmitting] = useState(false);
  
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  // Warehouse CRUD state
  const [warehouseForm, setWarehouseForm] = useState({ name: '', location: '' });
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  
  // Stock update state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustType, setAdjustType] = useState('RESTOCK');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustUnitCost, setAdjustUnitCost] = useState(0);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');
  
  // Movement state
  const [selectedSalesperson, setSelectedSalesperson] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubInventory, setSelectedSubInventory] = useState('ALL_STOCK');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const [invRes, logsRes, custRes, usersRes, whRes] = await Promise.all([
        fetch(`${API_URL}/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/inventory/logs`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/customers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/warehouses`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const invData = await invRes.json();
      const logsData = await logsRes.json();
      const custData = await custRes.json();
      const usersData = await usersRes.json();
      const whData = await whRes.json();

      if (invData.success) setInventory(invData.data);
      if (logsData.success) setLogs(logsData.data);
      if (custData.success) setCustomers(custData.data);
      if (usersData.success) setUsers(usersData.data);
      if (whData.success) {
        setWarehouses(whData.data);
        if (whData.data.length > 0 && !selectedWarehouseId) {
          setSelectedWarehouseId(whData.data[0].id.toString());
        }
      }

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
    const whId = selectedWarehouseId || (warehouses.length > 0 ? warehouses[0].id.toString() : '');
    if (!whId) return alert('No warehouse selected/available.');
    try {
      const res = await fetch(`${API_URL}/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: adjustType === 'RESTOCK' ? adjustAmount : -adjustAmount,
          type: adjustType,
          notes: adjustNotes,
          unit_cost: adjustType === 'RESTOCK' ? adjustUnitCost : 0,
          warehouse_id: parseInt(whId)
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
    if (!selectedSalesperson) return alert('Please select a recipient destination.');
    if (!adjustAmount || adjustAmount <= 0) return alert('Please enter a valid amount.');
    
    const sourceStaffId = selectedSubInventory.startsWith('SP_') ? selectedSubInventory.split('_')[1] : null;
    const sourceWarehouseId = selectedSubInventory.startsWith('WH_') ? selectedSubInventory.split('_')[1] : null;
    
    const isTargetWarehouse = selectedSalesperson.startsWith('WH_');
    const targetWarehouseId = isTargetWarehouse ? selectedSalesperson.split('_')[1] : null;
    const targetSalespersonId = isTargetWarehouse ? null : selectedSalesperson;

    let transactionType = 'ASSIGNMENT';
    let notesStr = '';

    if (sourceWarehouseId && isTargetWarehouse) {
      transactionType = 'TRANSFER';
      notesStr = `Transferred from warehouse ${warehouses.find(w => w.id == sourceWarehouseId)?.name} to warehouse ${warehouses.find(w => w.id == targetWarehouseId)?.name}. Notes: ${adjustNotes}`;
    } else if (sourceStaffId && isTargetWarehouse) {
      transactionType = 'RETURN';
      notesStr = `Returned from staff ${users.find(u => u.id == sourceStaffId)?.name} to warehouse ${warehouses.find(w => w.id == targetWarehouseId)?.name}. Notes: ${adjustNotes}`;
    } else if (sourceStaffId && !isTargetWarehouse) {
      transactionType = 'TRANSFER';
      notesStr = `Transferred from staff ${users.find(u => u.id == sourceStaffId)?.name} to staff ${users.find(u => u.id == targetSalespersonId)?.name}. Notes: ${adjustNotes}`;
    } else if (sourceWarehouseId && !isTargetWarehouse) {
      transactionType = 'ASSIGNMENT';
      notesStr = `Assigned from warehouse ${warehouses.find(w => w.id == sourceWarehouseId)?.name} to staff ${users.find(u => u.id == targetSalespersonId)?.name}. Notes: ${adjustNotes}`;
    }

    try {
      const res = await fetch(`${API_URL}/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: -adjustAmount,
          type: transactionType,
          notes: notesStr,
          unit_cost: 0,
          salesperson_id: targetSalespersonId || sourceStaffId, 
          source_salesperson_id: sourceStaffId,
          warehouse_id: targetWarehouseId || sourceWarehouseId,
          source_warehouse_id: sourceWarehouseId
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

  const handleWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseForm.name) return;
    const token = localStorage.getItem('token');
    try {
      const url = editingWarehouse 
        ? `${API_URL}/warehouses/${editingWarehouse.id}`
        : `${API_URL}/warehouses`;
      const method = editingWarehouse ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(warehouseForm)
      });
      const data = await res.json();
      if (data.success) {
        setWarehouseForm({ name: '', location: '' });
        setEditingWarehouse(null);
        fetchData();
      } else {
        alert(data.message || 'Error saving warehouse');
      }
    } catch (err) {
      alert('Error saving warehouse');
    }
  };

  const handleWarehouseDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this warehouse? All inventory associated with it will be lost.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/warehouses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || 'Error deleting warehouse');
      }
    } catch (err) {
      alert('Error deleting warehouse');
    }
  };

  const handleLoad = async () => {
    if (!loadDestination) return alert('Please select a destination (warehouse or salesperson).');
    const entries = Object.entries(loadQtys).filter(([, qty]) => parseInt(qty) > 0);
    if (entries.length === 0) return alert('Please enter at least one quantity to load.');

    const isWarehouse = loadDestination.startsWith('WH_');
    const warehouseId = isWarehouse ? parseInt(loadDestination.split('_')[1]) : null;
    const salespersonId = !isWarehouse ? parseInt(loadDestination) : null;

    setLoadSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await Promise.all(entries.map(([itemId, qty]) =>
        fetch(`${API_URL}/inventory/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            item_id: parseInt(itemId),
            quantity_changed: parseInt(qty),
            type: 'RESTOCK',
            notes: `Bulk Load to ${isWarehouse ? `Warehouse #${warehouseId}` : `Staff #${salespersonId}`}`,
            unit_cost: 0,
            warehouse_id: warehouseId,
            salesperson_id: salespersonId
          })
        })
      ));
      fetchData();
      setShowLoadModal(false);
      setLoadQtys({});
      setLoadDestination('');
      setLoadCategory('All');
    } catch {
      alert('Error loading stock. Please try again.');
    } finally {
      setLoadSubmitting(false);
    }
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-400 mx-auto">
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
          <button
            onClick={() => {
              setWarehouseForm({ name: '', location: '' });
              setEditingWarehouse(null);
              setShowWarehouseModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-gray-200 rounded-lg font-black shadow-sm h-fit hover:bg-gray-50 transition-all w-full sm:w-auto justify-center uppercase text-[11px] tracking-widest"
          >
            <Building className="w-4 h-4 text-slate-500" /> Warehouses
          </button>

          <Link
            href="/dashboard/inventory/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-black shadow-lg shadow-indigo-100 h-fit hover:bg-indigo-700 transition-all w-full sm:w-auto justify-center uppercase text-[11px] tracking-widest"
          >
            <PlusCircle className="w-4 h-4" /> Add New Stock
          </Link>

          <button
            onClick={() => {
              setLoadDestination('');
              setLoadCategory('All');
              setLoadQtys({});
              setShowLoadModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-black shadow-lg shadow-emerald-100 h-fit hover:bg-emerald-700 transition-all w-full sm:w-auto justify-center uppercase text-[11px] tracking-widest"
          >
            <Upload className="w-4 h-4" /> Load
          </button>

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

            <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm h-fit relative w-fit mb-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none px-2 pr-0">Sub-Inventory</span>
                <div className="relative flex items-center">
                  <select 
                    value={selectedSubInventory}
                    onChange={(e) => setSelectedSubInventory(e.target.value)}
                    className="bg-transparent text-slate-800 font-bold text-xs py-1.5 pl-2 pr-10 outline-none cursor-pointer appearance-none"
                  >
                    <option value="ALL_STOCK">🌍 Global Total</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={`WH_${w.id}`}>🏢 {w.name}</option>
                    ))}
                    {users.filter(u => u.role === 'staff').map(u => (
                      <option key={u.id} value={`SP_${u.id}`}>📍 {u.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                {(selectedSubInventory === 'ALL_STOCK' || selectedSubInventory.startsWith('WH_')) && <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Warehouse</th>}
                                {(selectedSubInventory === 'ALL_STOCK' || selectedSubInventory.startsWith('SP_')) && <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Staff Force</th>}
                                {selectedSubInventory === 'ALL_STOCK' && <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>}
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inventory.map(item => {
                                let staffStock = 0;
                                let warehouseStock = 0;

                                if (selectedSubInventory === 'ALL_STOCK') {
                                    warehouseStock = Number(item.warehouse_quantity || 0);
                                    staffStock = Number(item.salesperson_quantity || 0);
                                } else if (selectedSubInventory.startsWith('WH_')) {
                                    const whId = selectedSubInventory.split('_')[1];
                                    const whs = Array.isArray(item.warehouse_inventories) ? item.warehouse_inventories : [];
                                    const whData = whs.find((w: any) => w.warehouse_id?.toString() === whId);
                                    warehouseStock = Number(whData?.quantity || 0);
                                    staffStock = 0;
                                } else if (selectedSubInventory.startsWith('SP_')) {
                                    const spId = selectedSubInventory.split('_')[1];
                                    const subs = Array.isArray(item.sub_inventories) ? item.sub_inventories : [];
                                    const spData = subs.find((s: any) => s.user_id?.toString() === spId);
                                    staffStock = Number(spData?.quantity || 0);
                                    warehouseStock = 0;
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
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-indigo-600">{item.category_name || 'N/A'}</span>
                                        </td>
                                        {(selectedSubInventory === 'ALL_STOCK' || selectedSubInventory.startsWith('WH_')) && <td className="px-6 py-4 text-center font-bold text-slate-600">{warehouseStock}</td>}
                                        {(selectedSubInventory === 'ALL_STOCK' || selectedSubInventory.startsWith('SP_')) && <td className="px-6 py-4 text-center font-bold text-amber-600">+{staffStock}</td>}
                                        {selectedSubInventory === 'ALL_STOCK' && <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{rowTotal}</td>}
                                        <td className="px-6 py-4">
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                                                rowTotal <= (item.reorder_level || 0) ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                             }`}>
                                                {rowTotal <= (item.reorder_level || 0) ? 'RESTOCK' : 'OK'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {selectedSubInventory !== 'ALL_STOCK' && (
                                                  <button 
                                                    onClick={() => { 
                                                      setSelectedItem(item); 
                                                      setAdjustAmount(0); 
                                                      setSelectedSalesperson(''); 
                                                      setAdjustNotes(''); 
                                                      setShowAssignModal(true); 
                                                    }} 
                                                    className="text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50 transition-colors"
                                                  >
                                                    Move
                                                  </button>
                                                )}
                                                {!selectedSubInventory.startsWith('SP_') && (
                                                  <button 
                                                    onClick={() => { 
                                                      setSelectedItem(item); 
                                                      setAdjustAmount(0); 
                                                      setAdjustNotes(''); 
                                                      setAdjustType('RESTOCK'); 
                                                      setAdjustUnitCost(0); 
                                                      if (selectedSubInventory.startsWith('WH_')) {
                                                        setSelectedWarehouseId(selectedSubInventory.split('_')[1]);
                                                      }
                                                      setShowAdjustModal(true); 
                                                    }} 
                                                    className="text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                                                  >
                                                    Adjust
                                                  </button>
                                                )}
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
                                        log.type === 'TRANSFER' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
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

      {/* Warehouses Management Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowWarehouseModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Manage Warehouses</h2>
              </div>
              <button onClick={() => setShowWarehouseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWarehouseSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-gray-100">
              <div className="sm:col-span-1 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Colombo Central"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                  value={warehouseForm.name}
                  onChange={e => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                />
              </div>
              <div className="sm:col-span-1 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location / Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sector 4"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                  value={warehouseForm.location}
                  onChange={e => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition"
              >
                {editingWarehouse ? 'Update' : 'Add WH'}
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {warehouses.length === 0 ? (
                <div className="text-center py-6 text-slate-400 italic text-xs font-medium">No warehouses registered. Add one above.</div>
              ) : (
                warehouses.map(w => (
                  <div key={w.id} className="flex justify-between items-center p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{w.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{w.location || 'No location description'}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setEditingWarehouse(w);
                          setWarehouseForm({ name: w.name, location: w.location || '' });
                        }} 
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleWarehouseDelete(w.id)} 
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign / Move Modal */}
      {showAssignModal && selectedItem && (() => {
        const sourceStaffId = selectedSubInventory.startsWith('SP_') ? selectedSubInventory.split('_')[1] : null;
        const sourceWarehouseId = selectedSubInventory.startsWith('WH_') ? selectedSubInventory.split('_')[1] : null;

        const assignMax = (() => {
          if (sourceStaffId) {
            const subs = Array.isArray(selectedItem.sub_inventories) ? selectedItem.sub_inventories : [];
            const spData = subs.find((s: any) => s.user_id?.toString() === sourceStaffId);
            return Number(spData?.quantity || 0);
          }
          if (sourceWarehouseId) {
            const whs = Array.isArray(selectedItem.warehouse_inventories) ? selectedItem.warehouse_inventories : [];
            const whData = whs.find((w: any) => w.warehouse_id?.toString() === sourceWarehouseId);
            return Number(whData?.quantity || 0);
          }
          return 0;
        })();

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Assign / Move Stock</h2>
              </div>
              
              <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Destination</label>
                    <select
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer appearance-none"
                        value={selectedSalesperson}
                        onChange={e => setSelectedSalesperson(e.target.value)}
                    >
                        <option value="">Choose destination...</option>
                        {/* If source is staff, they can return to ANY warehouse */}
                        {sourceStaffId && warehouses.map(w => (
                          <option key={w.id} value={`WH_${w.id}`}>🏢 Return to: {w.name}</option>
                        ))}
                        {/* If source is warehouse, we can move to ANY OTHER warehouse */}
                        {sourceWarehouseId && warehouses.filter(w => w.id.toString() !== sourceWarehouseId).map(w => (
                          <option key={w.id} value={`WH_${w.id}`}>🏢 Move to Warehouse: {w.name}</option>
                        ))}
                        {/* Can always assign/transfer to any staff member */}
                        {users.filter(u => u.role === 'staff' && u.id.toString() !== sourceStaffId).map(u => (
                            <option key={u.id} value={u.id}>📍 Assign to Staff: {u.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount to Transfer</label>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available: <span className="text-indigo-600">{assignMax}</span></span>
                    </div>
                    <input
                        type="number"
                        required
                        min="1"
                        max={assignMax}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-2xl font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-600/10"
                        placeholder="0"
                        value={adjustAmount || ''}
                        onChange={e => { const val = parseInt(e.target.value) || 0; setAdjustAmount(val > assignMax ? assignMax : val); }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                      placeholder="Reason or transaction notes..."
                      value={adjustNotes}
                      onChange={e => setAdjustNotes(e.target.value)}
                    />
                  </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-2.5 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-lg transition">Cancel</button>
                <button
                  type="submit"
                  onClick={handleAssign}
                  className="flex-2 py-2.5 font-black text-white bg-emerald-600 rounded-lg shadow-lg shadow-emerald-100 uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition"
                >
                  Confirm Movement
                </button>
              </div>
          </div>
        </div>
        );
      })()}

      {/* Adjust Modal */}
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Target Warehouse</label>
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer appearance-none"
                      value={selectedWarehouseId}
                      onChange={e => setSelectedWarehouseId(e.target.value)}
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>🏢 {w.name}</option>
                      ))}
                    </select>
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

                  {adjustType === 'RESTOCK' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                        placeholder="0.00"
                        value={adjustUnitCost || ''}
                        onChange={e => setAdjustUnitCost(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                      placeholder="Reason or transaction notes..."
                      value={adjustNotes}
                      onChange={e => setAdjustNotes(e.target.value)}
                    />
                  </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button onClick={() => setShowAdjustModal(false)} className="flex-1 py-2.5 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-lg transition">Dismiss</button>
                  <button onClick={handleAdjust} className="flex-2 py-2.5 bg-indigo-600 text-white rounded-lg font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">Commit Update</button>
              </div>
          </div>
        </div>
      )}
      {/* Load Modal - Bulk Stock Update */}
      {showLoadModal && (() => {
        const categories = ['All', ...Array.from(new Set(inventory.map((i: any) => i.category_name).filter(Boolean)))];
        const filteredItems = loadCategory === 'All'
          ? inventory
          : inventory.filter((i: any) => i.category_name === loadCategory);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLoadModal(false)} />
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Bulk Load Stock</h2>
                    <p className="text-[10px] text-slate-400 font-medium">Enter quantities to update multiple items at once.</p>
                  </div>
                </div>
                <button onClick={() => setShowLoadModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-5 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destination</label>
                  <select
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer"
                    value={loadDestination}
                    onChange={e => setLoadDestination(e.target.value)}
                  >
                    <option value="">Select warehouse or salesperson...</option>
                    <optgroup label="🏢 Warehouses">
                      {warehouses.map(w => (
                        <option key={w.id} value={`WH_${w.id}`}>{w.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Salespersons">
                      {users.filter(u => u.role === 'staff').map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                  <select
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer"
                    value={loadCategory}
                    onChange={e => { setLoadCategory(e.target.value); setLoadQtys({}); }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scrollable Item List */}
              <div className="overflow-y-auto flex-1 min-h-0">
                {filteredItems.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 italic text-sm">No items found in this category.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Add Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-5 py-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">{item.item_name}</span>
                              <span className="text-[10px] text-slate-400 font-mono uppercase">{item.item_number}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="text-sm font-black text-slate-600">{item.total_quantity || 0}</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-sm font-black text-emerald-700 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
                              value={loadQtys[item.id] || ''}
                              onChange={e => setLoadQtys(prev => ({ ...prev, [item.id]: e.target.value }))}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {Object.values(loadQtys).filter(q => parseInt(q) > 0).length} item(s) to load
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowLoadModal(false)} className="px-5 py-2.5 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-lg transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleLoad}
                    disabled={loadSubmitting}
                    className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    {loadSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {loadSubmitting ? 'Loading...' : 'Load Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
