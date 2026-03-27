"use client";
import { useState, useEffect } from 'react';
import { Plus, Store, Search, Edit, Trash2, X, MapPin, Phone } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '', account_id: '', permit_numbers: '' });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchShops = async () => {
    try {
      const res = await fetch(`${API_URL}/shops`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setShops(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `${API_URL}/shops/${editId}` : `${API_URL}/shops`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        fetchShops();
        setShowModal(false);
        setFormData({ name: '', address: '', contact: '', account_id: '', permit_numbers: '' });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isEdit ? "Error updating shop" : "Error adding shop");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shop: any) => {
    setFormData({
      name: shop.name || '',
      address: shop.address || '',
      contact: shop.contact || '',
      account_id: shop.account_id || '',
      permit_numbers: shop.permit_numbers || ''
    });
    setEditId(shop.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/shops/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchShops();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting shop");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Active Shops</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure network branches & locations.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({ name: '', address: '', contact: '', account_id: '', permit_numbers: '' });
            setShowModal(true);
          }}
          className="bg-emerald-600 shadow-sm shadow-emerald-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Onboard Branch
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search branches..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Branch Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Account #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Physical Address</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Contact Line</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Permits</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {shops.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[11px] text-gray-500 font-mono tracking-wider">{s.account_id || `ID-${s.id.toString().padStart(6, '0')}`}</span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm text-gray-600 line-clamp-1">{s.address}</p>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {s.contact ? (
                      <span className="text-sm text-gray-700 font-medium">{s.contact}</span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No contact</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-slate-500 font-medium">{s.permit_numbers || '—'}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit Parameters"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Decommission Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {shops.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center">
              <Store className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No active branches</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Scale your business by onboarding new retail or branch locations.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 text-emerald-600 font-semibold hover:underline"
              >
                Create first branch
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isEdit ? 'Modify Branch Parameters' : 'Configure New Branch'}
              </h2>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Branch Classification Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="e.g. Downtown Central" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Physical Location</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition resize-none h-28" placeholder="Enter complete physical address..." required
                    value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Internal Account #</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="e.g. 61506"
                      value={formData.account_id} onChange={e => setFormData({ ...formData, account_id: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Direct Terminal Line</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="(555) 123-4567"
                      value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Regulatory Permits (TABC etc.)</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition" placeholder="e.g. W 820091, BC 820093"
                    value={formData.permit_numbers} onChange={e => setFormData({ ...formData, permit_numbers: e.target.value })} />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-gray-50 transition">Dismiss</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition disabled:opacity-50">
                  {loading ? (isEdit ? 'Updating...' : 'Committing...') : (isEdit ? 'Update Branch' : 'Commit Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Decommission Branch"
        message="Are you sure you want to decommission this branch? This will immediately remove it from the active distribution network."
      />
    </div>
  );
}
