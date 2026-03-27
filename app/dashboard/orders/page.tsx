"use client";
import { useState, useEffect } from 'react';
import { Plus, ClipboardList, Search, Eye, Trash2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/orders/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Capture and track distribution shipments.</p>
        </div>
        <button
          disabled
          className="bg-gray-200 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-100"
          title="Module deployment in progress"
        >
          <Plus className="w-5 h-5 opacity-50" />
          Create New Order (Soon)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order # or Shop..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Order #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Load #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Service Shop</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Personnel</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Credits</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Deposits</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Total Value</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Timestamp</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                    {o.order_number}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs font-mono text-gray-500">
                    {o.load_number || '—'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">
                    {o.shop_name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                    {o.user_name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-red-500">
                    -${parseFloat(o.total_credits || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-emerald-600">
                    +${parseFloat(o.total_deposit || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-blue-600">
                    ${parseFloat(o.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                      o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(o.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Void Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center">
              <ClipboardList className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No documented orders</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Capture new shipment metrics by initializing an order from the node management matrix.</p>
              <button
                disabled
                className="mt-6 text-gray-400 font-semibold cursor-not-allowed bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
              >
                Create the first order
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Void System Order"
        message="Are you sure you want to void this order? This will permanently remove its transaction record and itemized metrics."
      />
    </div>
  );
}
