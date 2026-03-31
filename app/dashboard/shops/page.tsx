"use client";
import { useState, useEffect } from 'react';
import { Plus, Store, Search, Edit, Trash2, X, MapPin, Phone } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', account_id: '', permit_numbers: '',
    registered_company_name: '', dba: '', email: '', sales_tax_id: '',
    has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
  });
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
        setFormData({
          name: '', address: '', phone: '', account_id: '', permit_numbers: '',
          registered_company_name: '', dba: '', email: '', sales_tax_id: '',
          has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
        });
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
      phone: shop.phone || '',
      account_id: shop.account_id || '',
      permit_numbers: shop.permit_numbers || '',
      registered_company_name: shop.registered_company_name || '',
      dba: shop.dba || '',
      email: shop.email || '',
      sales_tax_id: shop.sales_tax_id || '',
      has_cigarette_permit: shop.has_cigarette_permit || false,
      tobacco_permit_number: shop.tobacco_permit_number || '',
      tobacco_expire_date: shop.tobacco_expire_date ? new Date(shop.tobacco_expire_date).toISOString().split('T')[0] : '',
      payment_type: shop.payment_type || 'COD'
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
            setFormData({
              name: '', address: '', phone: '', account_id: '', permit_numbers: '',
              registered_company_name: '', dba: '', email: '', sales_tax_id: '',
              has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
            });
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
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Internal Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Account #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">DBA / Company</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Tax ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {shops.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[11px] text-gray-500 font-mono tracking-wider">{s.account_id}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{s.dba || '—'}</span>
                      <span className="text-xs text-gray-500">{s.registered_company_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">{s.sales_tax_id || '—'}</span>
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
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isEdit ? 'Modify Branch Parameters' : 'Configure New Branch'}
              </h2>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Business Identity</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Internal System Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="e.g. Downtown Central" required
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Registered Company Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="Legal Entity Name"
                      value={formData.registered_company_name} onChange={e => setFormData({ ...formData, registered_company_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">DBA (Doing Business As)</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="Store Front Name"
                      value={formData.dba} onChange={e => setFormData({ ...formData, dba: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Account Number</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-100 border border-gray-100 text-gray-500 rounded-xl text-sm" placeholder="Automatically Generated" disabled
                      value={formData.account_id} />
                    <p className="text-[10px] text-amber-600 mt-1 font-medium italic">Auto-generated</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Contact & Location</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Physical Address</label>
                    <textarea className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition resize-none h-20 text-sm" placeholder="Enter complete address..." required
                      value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Email Address</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="contact@shop.com"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Phone Number</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="(555) 000-0000"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Compliance & Finance</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Sales Tax ID</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="Tax Identification Number"
                      value={formData.sales_tax_id} onChange={e => setFormData({ ...formData, sales_tax_id: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Payment Type</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm"
                      value={formData.payment_type} onChange={e => setFormData({ ...formData, payment_type: e.target.value })}>
                      <option value="COD">COD (Cash on Delivery)</option>
                      <option value="EFT">EFT (Electronic Funds Transfer)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <input type="checkbox" id="tobacco" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        checked={formData.has_cigarette_permit} onChange={e => setFormData({ ...formData, has_cigarette_permit: e.target.checked })} />
                      <label htmlFor="tobacco" className="text-sm font-bold text-slate-700 cursor-pointer">Cigarette / Tobacco Permit</label>
                    </div>
                    {formData.has_cigarette_permit && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Permit Number</label>
                          <input type="text" className="w-full px-3 py-2 bg-white border border-gray-100 focus:border-emerald-500 rounded-lg text-sm" placeholder="Permit #"
                            value={formData.tobacco_permit_number} onChange={e => setFormData({ ...formData, tobacco_permit_number: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Expiry Date</label>
                          <input type="date" className="w-full px-3 py-2 bg-white border border-gray-100 focus:border-emerald-500 rounded-lg text-sm"
                            value={formData.tobacco_expire_date} onChange={e => setFormData({ ...formData, tobacco_expire_date: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Additional Meta</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">General Permit Notes</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 rounded-xl transition text-sm" placeholder="Other permits or regulatory info"
                      value={formData.permit_numbers} onChange={e => setFormData({ ...formData, permit_numbers: e.target.value })} />
                  </div>
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
