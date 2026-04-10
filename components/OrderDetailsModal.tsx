"use client";
import { X, Receipt, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { useState } from 'react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdate: () => void;
}

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdate }: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: 'completed' })
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.subtotal || 0), 0) || 0;
  const credits = parseFloat(order.total_credits || 0);
  const deposits = parseFloat(order.total_deposit || 0);
  const netTotal = parseFloat(order.total_amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Order Details</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-700 border-slate-100'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{order.order_number} • {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Customer & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Retailer / Shop</span>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{order.customer_name || 'N/A'}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Customer Record</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Deployment Info</span>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Load #</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{order.load_number || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Personnel</span>
                  <span className="text-xs font-bold text-slate-800">{order.user_name || '—'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Audit Status</span>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
                {order.status === 'completed' ? (
                  <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                    <Clock className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase">{order.status === 'completed' ? 'Finalized' : 'Pending Review'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">System Integrity Valid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Itemized Inventory Allocation</span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{order.items?.length || 0} Products</span>
            </div>
            
            <div className="border border-slate-100 rounded-4xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-black text-slate-700 uppercase">{item.item_name}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 text-center font-mono">{item.quantity}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-400 text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 text-right font-mono">${parseFloat(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No item data associated with this entry</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Transaction Ledger Notes</span>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-30 text-xs font-medium text-slate-600 leading-relaxed italic">
                {order.notes || "No additional transaction notes documented in the ledger."}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl shadow-slate-200">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Gross Item Subtotal</span>
                <span className="text-slate-200 font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black text-rose-400 uppercase tracking-widest">
                <span>Credit Memos applied (-)</span>
                <span className="font-mono">-${credits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                <span>Container Deposits (+)</span>
                <span className="font-mono">+${deposits.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Invoice Payload</span>
                  <span className="text-4xl font-black text-white tracking-tighter transition-all">${netTotal.toFixed(2)}</span>
                </div>
                {order.status === 'pending' && (
                  <button
                    onClick={handleConfirm}
                    disabled={isUpdating}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 transition active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Executing Trace...' : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">System Generated Audit Document • Super Vendor Distribution Network</p>
        </div>
      </div>
    </div>
  );
}
