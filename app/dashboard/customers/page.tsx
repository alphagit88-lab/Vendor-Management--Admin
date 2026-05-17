"use client";
import { useState, useEffect } from 'react';
import { Plus, Users, Search, Edit, Trash2, X, MapPin, Phone, Building2, UserPlus, Layers, Target, RefreshCw } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';
import MapPicker from '@/components/MapPicker';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerGroups, setCustomerGroups] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [formData, setFormData] = useState({
    address: '', phone: '', account_id: '', permit_numbers: '',
    registered_company_name: '', dba: '', email: '', sales_tax_id: '',
    has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD',
    latitude: undefined as number | undefined, longitude: undefined as number | undefined,
    group_id: '' as string | number
  });
  const [groupFormData, setGroupFormData] = useState({
    name: '', description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groupSubmitting, setGroupSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isGroupEdit, setIsGroupEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGroupDeleteConfirm, setShowGroupDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGroupDeleting, setIsGroupDeleting] = useState(false);

  const [showParModal, setShowParModal] = useState(false);
  const [selectedParCustomer, setSelectedParCustomer] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedItemCategory, setSelectedItemCategory] = useState<number | 'all'>('all');
  const [parLevels, setParLevels] = useState<Record<number, string>>({});
  const [isSavingPars, setIsSavingPars] = useState(false);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const [custRes, groupRes] = await Promise.all([
        fetch(`${API_URL}/customers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/customer-groups`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const custData = await custRes.json();
      const groupData = await groupRes.json();

      if (custData.success) setCustomers(custData.data);
      if (groupData.success) setCustomerGroups(groupData.data);
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
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude.toString()) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude.toString()) : null,
          group_id: formData.group_id || null
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowModal(false);
        setFormData({
          address: '', phone: '', account_id: '', permit_numbers: '',
          registered_company_name: '', dba: '', email: '', sales_tax_id: '',
          has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD',
          latitude: undefined, longitude: undefined, group_id: ''
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

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupSubmitting(true);
    try {
      const url = isGroupEdit ? `${API_URL}/customer-groups/${editGroupId}` : `${API_URL}/customer-groups`;
      const method = isGroupEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(groupFormData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowGroupModal(false);
        setGroupFormData({ name: '', description: '' });
        setIsGroupEdit(false);
        setEditGroupId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isGroupEdit ? "Error updating group" : "Error adding group");
    } finally {
      setGroupSubmitting(false);
    }
  };

  const handleOpenParModal = async (customer: any) => {
    setSelectedParCustomer(customer);
    setParLevels(customer.par_levels || {});
    setShowParModal(true);
    setSelectedItemCategory('all');
    
    if (items.length === 0) {
      try {
        const token = localStorage.getItem('token');
        const [itemsRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/items`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        if (itemsData.success) setItems(itemsData.data);
        if (catsData.success) setCategories(catsData.data);
      } catch (err) {
        console.error("Error fetching items/categories", err);
      }
    }
  };

  const handleSaveParLevels = async () => {
    if (!selectedParCustomer) return;
    setIsSavingPars(true);
    try {
      const res = await fetch(`${API_URL}/customers/${selectedParCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          par_levels: parLevels
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowParModal(false);
        fetchCustomers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error saving par levels");
    } finally {
      setIsSavingPars(false);
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
      payment_type: customer.payment_type || 'COD',
      latitude: customer.latitude ? parseFloat(customer.latitude) : undefined,
      longitude: customer.longitude ? parseFloat(customer.longitude) : undefined,
      group_id: customer.group_id || ''
    });
    setEditId(customer.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleGroupEdit = (group: any) => {
    setGroupFormData({
      name: group.name || '',
      description: group.description || ''
    });
    setEditGroupId(group.id);
    setIsGroupEdit(true);
    setShowGroupModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleGroupDelete = (id: number) => {
    setDeleteGroupId(id);
    setShowGroupDeleteConfirm(true);
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

  const confirmGroupDelete = async () => {
    if (!deleteGroupId) return;
    setIsGroupDeleting(true);
    try {
      const res = await fetch(`${API_URL}/customer-groups/${deleteGroupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowGroupDeleteConfirm(false);
        setDeleteGroupId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting group");
    } finally {
      setIsGroupDeleting(false);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-400 mx-auto">
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
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsGroupEdit(false);
              setEditGroupId(null);
              setGroupFormData({ name: '', description: '' });
              setShowGroupModal(true);
            }}
            className="bg-white border border-gray-200 text-slate-700 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all font-medium shadow-sm"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Customer Groups
          </button>
          <button
            onClick={() => {
              setIsEdit(false);
              setEditId(null);
              setFormData({
                address: '', phone: '', account_id: '', permit_numbers: '',
                registered_company_name: '', dba: '', email: '', sales_tax_id: '',
                has_cigarette_permit: false, tobacco_permit_number: '', tobacco_expire_date: '', payment_type: 'COD',
                latitude: undefined, longitude: undefined, group_id: ''
              });
              setShowModal(true);
            }}
            className="bg-emerald-600 shadow-sm shadow-emerald-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Customer
          </button>
        </div>
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
          <table className="w-full min-w-200 text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Account #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">DBA / Company</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Group</th>
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.group_id ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                      {customerGroups.find(g => g.id === c.group_id)?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">{c.sales_tax_id || '—'}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenParModal(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                        title="Set Par Levels"
                      >
                        <Target className="w-4 h-4" />
                      </button>
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
                  {isEdit ? 'Update Customer' : 'Register Retailer'}
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

                <div className="md:col-span-2 space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Geographic Coordinates</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                       <MapPicker 
                        lat={formData.latitude} 
                        lng={formData.longitude} 
                        onChange={(lat, lng, address) => setFormData(prev => ({ 
                          ...prev, 
                          latitude: lat, 
                          longitude: lng,
                          address: address || prev.address
                        }))} 
                       />
                       <p className="text-[9px] text-slate-400 mt-2 italic font-medium uppercase tracking-widest">Click on map to pin precise delivery coordinates.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Latitude</label>
                        <input type="text" readOnly className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono text-slate-500" value={formData.latitude || 'Not set'} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Longitude</label>
                        <input type="text" readOnly className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono text-slate-500" value={formData.longitude || 'Not set'} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Classification</h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                    <div className="max-w-md">
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Assign Group</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-lg transition text-sm font-black outline-none appearance-none cursor-pointer"
                        value={formData.group_id} 
                        onChange={e => setFormData({ ...formData, group_id: e.target.value })}
                      >
                        <option value="">-- No Group (Unassigned) --</option>
                        {customerGroups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Groups determine special pricing rules for items.</p>
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

      <ConfirmModal
        isOpen={showGroupDeleteConfirm}
        onClose={() => setShowGroupDeleteConfirm(false)}
        onConfirm={confirmGroupDelete}
        isLoading={isGroupDeleting}
        title="Delete Customer Group"
        message="Are you sure you want to delete this group? Customers in this group will become unassigned and group-specific pricing will be removed."
      />

      {/* Group Management Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowGroupModal(false)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Customer Group Management</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Organize retailers for bulk pricing rules</p>
                </div>
              </div>
              <button onClick={() => setShowGroupModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* List Groups */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Groups</h3>
                <div className="space-y-3">
                  {customerGroups.map(group => (
                    <div key={group.id} className="p-4 bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{group.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{group.customer_count || 0} Members Attached</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleGroupEdit(group)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleGroupDelete(group.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {customerGroups.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                      <Layers className="w-10 h-10 text-slate-100 mx-auto mb-3" />
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No Groups Found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form to Create/Edit Group */}
              <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col h-fit">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">
                  {isGroupEdit ? 'Edit Group parameters' : 'Define New Group'}
                </h3>
                <form onSubmit={handleGroupSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Group Label</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-100 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-xl transition text-sm font-bold outline-none" 
                      placeholder="e.g. Convenience Stores"
                      value={groupFormData.name}
                      onChange={e => setGroupFormData({ ...groupFormData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Strategic Description</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-100 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 rounded-xl transition text-sm font-medium outline-none resize-none h-24" 
                      placeholder="Define the scope of this group..."
                      value={groupFormData.description}
                      onChange={e => setGroupFormData({ ...groupFormData, description: e.target.value })}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    {isGroupEdit && (
                      <button 
                        type="button" 
                        onClick={() => { setIsGroupEdit(false); setEditGroupId(null); setGroupFormData({ name: '', description: '' }); }}
                        className="flex-1 py-3 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      disabled={groupSubmitting}
                      className="flex-2 py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-100 uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {groupSubmitting ? 'Syncing...' : isGroupEdit ? 'Update Group' : 'Commit Group'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showParModal && selectedParCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowParModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    Par Levels: {selectedParCustomer.dba || selectedParCustomer.registered_company_name}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Set inventory thresholds</p>
                </div>
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowParModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Filter by Category</label>
                  <select
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-blue-500/50 outline-none"
                    value={selectedItemCategory}
                    onChange={(e) => setSelectedItemCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="bg-gray-50/90 backdrop-blur-sm border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Item Number</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Par Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.filter(item => selectedItemCategory === 'all' || item.category_id === selectedItemCategory).map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono text-slate-500">{item.item_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900">{item.description_name}</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-24 px-3 py-1.5 text-right bg-white border border-gray-200 rounded-lg text-sm font-black focus:ring-2 focus:ring-blue-500/50 outline-none"
                          value={parLevels[item.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setParLevels(prev => {
                              const next = { ...prev };
                              if (!val || parseInt(val) === 0) {
                                delete next[item.id];
                              } else {
                                next[item.id] = val;
                              }
                              return next;
                            });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                     <tr>
                       <td colSpan={3} className="text-center p-8 text-slate-400 text-sm font-medium">Loading items...</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {Object.keys(parLevels).length} items configured
              </span>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowParModal(false)} className="px-6 py-2.5 font-bold text-slate-500 rounded-lg hover:bg-gray-50 transition uppercase text-[10px] tracking-widest">
                  Cancel
                </button>
                <button 
                  onClick={handleSaveParLevels}
                  disabled={isSavingPars} 
                  className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:opacity-50 uppercase text-[10px] tracking-widest flex items-center gap-2"
                >
                  {isSavingPars ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  {isSavingPars ? 'Saving...' : 'Save Par Levels'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
