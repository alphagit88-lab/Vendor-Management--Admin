"use client";
import { useState, useEffect } from 'react';
import { Plus, Users, Search, Edit, Trash2, X, MapPin, Phone, Building2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    address: '', phone: '', account_id: '', permit_numbers: '',
    registered_company_name: '', dba: '', email: '', sales_tax_id: '',
    has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = isEdit ? `${API_URL}/customers/${editId}` : `${API_URL}/customers`;
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
        fetchCustomers();
        setShowModal(false);
        setFormData({
          address: '', phone: '', account_id: '', permit_numbers: '',
          registered_company_name: '', dba: '', email: '', sales_tax_id: '',
          has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
        });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isEdit ? "Error updating customer" : "Error adding customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer: any) => {
    setFormData({
      address: customer.address || '',
      phone: customer.phone || '',
      account_id: customer.account_id || '',
      permit_numbers: customer.permit_numbers || '',
      registered_company_name: customer.registered_company_name || '',
      dba: customer.dba || '',
      email: customer.email || '',
      sales_tax_id: customer.sales_tax_id || '',
      has_cigarette_permit: customer.has_cigarette_permit || false,
      tobacco_permit_number: customer.tobacco_permit_number || '',
      tobacco_expire_date: customer.tobacco_expire_date ? new Date(customer.tobacco_expire_date).toISOString().split('T')[0] : '',
      payment_type: customer.payment_type || 'COD'
    });
    setEditId(customer.id);
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
      const res = await fetch(`${API_URL}/customers/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting customer");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-48 bg-emerald-50 border border-emerald-100 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-50 border-t-emerald-600 rounded-full animate-spin" />
              <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Retrieving Retailer Accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Active Customers</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage customer accounts & data.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({
              address: '', phone: '', account_id: '', permit_numbers: '',
              registered_company_name: '', dba: '', email: '', sales_tax_id: '',
              has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD'
            });
            setShowModal(true);
          }}
          className="bg-emerald-600 shadow-sm shadow-emerald-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Account #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">DBA / Company</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Tax ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[11px] text-gray-500 font-mono tracking-wider">{c.account_id}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{c.dba || '—'}</span>
                      <span className="text-xs text-gray-500">{c.registered_company_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">{c.sales_tax_id || '—'}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all font-medium"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && !loading && (
            <div className="p-16 text-center flex flex-col items-center">
              <Users className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No active customers</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Scale your business by adding new customer records.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 text-emerald-600 font-semibold hover:underline"
              >
                Add first customer
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {isEdit ? 'Update Customer Node' : 'Register Retailer'}
                </h2>
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Business Identity</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Registered Company Name</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-medium outline-none" placeholder="Legal Entity Name"
                        value={formData.registered_company_name} onChange={e => setFormData({ ...formData, registered_company_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">DBA (Doing Business As)</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-medium outline-none" placeholder="Store Front Name"
                        value={formData.dba} onChange={e => setFormData({ ...formData, dba: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Account Number</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-gray-200 text-slate-400 rounded-lg text-sm font-mono" placeholder="Automatically Generated" disabled
                        value={formData.account_id} />
                      <p className="text-[10px] text-amber-600 mt-1 font-black uppercase tracking-tight italic">Auto-generated System ID</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact & Logistics</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Physical Address</label>
                      <textarea className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition resize-none h-20 text-sm font-medium outline-none" placeholder="Enter complete address..." required
                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-medium outline-none" placeholder="contact@customer.com"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Phone Number</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-medium outline-none" placeholder="(555) 000-0000"
                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Compliance & Settlement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Sales Tax ID</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-mono outline-none" placeholder="Tax Identification Number"
                        value={formData.sales_tax_id} onChange={e => setFormData({ ...formData, sales_tax_id: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Settlement Type</label>
                      <select className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-black outline-none appearance-none cursor-pointer"
                        value={formData.payment_type} onChange={e => setFormData({ ...formData, payment_type: e.target.value })}>
                        <option value="COD">COD (Cash on Delivery)</option>
                        <option value="EFT">EFT (Electronic Funds Transfer)</option>
                      </select>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <input type="checkbox" id="tobacco" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 transition cursor-pointer"
                          checked={formData.has_cigarette_permit} onChange={e => setFormData({ ...formData, has_cigarette_permit: e.target.checked })} />
                        <label htmlFor="tobacco" className="text-[11px] font-black text-slate-700 cursor-pointer uppercase tracking-wider">Tobacco Regulatory Permit</label>
                      </div>
                      {formData.has_cigarette_permit && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Permit Number</label>
                            <input type="text" className="w-full px-3 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg text-xs font-mono outline-none" placeholder="Permit #"
                              value={formData.tobacco_permit_number} onChange={e => setFormData({ ...formData, tobacco_permit_number: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Expiration Milestone</label>
                            <input type="date" className="w-full px-3 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg text-xs font-medium outline-none"
                              value={formData.tobacco_expire_date} onChange={e => setFormData({ ...formData, tobacco_expire_date: e.target.value })} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Auxiliary Parameters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Regulatory Metadata</label>
                      <textarea className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition resize-none h-24 text-sm font-medium outline-none" placeholder="Other permits or regulatory info"
                        value={formData.permit_numbers} onChange={e => setFormData({ ...formData, permit_numbers: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-500 rounded-lg hover:bg-gray-50 transition uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={submitting} className="px-8 py-2.5 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition disabled:opacity-50 uppercase text-[10px] tracking-widest">
                  {submitting ? (isEdit ? 'Updating Node...' : 'Registering...') : (isEdit ? 'Update Record' : 'Commit Registry')}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This will immediately remove them from your active records."
      />
    </div>
  );
}
