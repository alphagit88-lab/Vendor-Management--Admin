"use client";
import { useState, useEffect } from 'react';
import { Plus, ClipboardList, Search, Eye, Trash2, Truck } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // View Details State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewDetails = async (id: number) => {
    setIsFetchingDetail(true);
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingDetail(false);
    }
  };

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

  if (loading && orders.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-400 mx-auto">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-48 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-50 border-t-blue-600 rounded-full animate-spin" />
              <Truck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Tracing Logistics Network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Capture and track distribution shipments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order # or Shop..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
            />
          </div>
          {searchTerm && (
            <span className="ml-4 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
              Found {filteredOrders.length} results
            </span>
          )}
        </div>

        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Order #</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Load #</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Service Shop</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Personnel</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Credits</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Deposits</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Total Value</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Status</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Timestamp</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                    {o.order_number}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-xs font-mono text-gray-500">
                    {o.load_number || '—'}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-semibold text-gray-700">
                    {o.customer_name || 'N/A'}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-600">
                    {o.user_name}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-red-500">
                    -${parseFloat(o.total_credits || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-emerald-600">
                    +${parseFloat(o.total_deposit || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-bold text-blue-600">
                    ${parseFloat(o.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                      o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-xs text-gray-500">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleViewDetails(o.id)}
                        disabled={isFetchingDetail}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium disabled:opacity-50" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(o.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
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
          {filteredOrders.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center">
              <ClipboardList className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No matching orders</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Adjust your search criteria to find specific logistics records.</p>
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
      <OrderDetailsModal 
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        order={selectedOrder}
        onUpdate={fetchOrders}
      />
    </div>
  );
}
