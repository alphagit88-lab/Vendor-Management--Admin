"use client";
import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, X, Search, Layers, Boxes } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description_name: '', price: '', description: '',
    item_number: '', upc: '', cost: '', quantity_size: '', vendor_cost: '',
    category_id: ''
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([
        fetch(`${API_URL}/items`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);
      const itemsData = await itemsRes.json();
      const catData = await catRes.json();
      if (itemsData.success) setItems(itemsData.data);
      if (catData.success) setCategories(catData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter(i => {
    const matchesCategory = selectedCategory === 'All' || (i.category_name || 'Uncategorized') === selectedCategory;
    const matchesSearch = 
      i.description_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.item_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.category_name || 'Uncategorized').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = isEdit ? `${API_URL}/items/${editId}` : `${API_URL}/items`;
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
        fetchData();
        setShowModal(false);
        setFormData({
          description_name: '', price: '', description: '',
          item_number: '', upc: '', cost: '', quantity_size: '', vendor_cost: '',
          category_id: ''
        });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isEdit ? "Error updating item" : "Error adding item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      description_name: item.description_name || '',
      price: item.price || '',
      description: item.description || '',
      item_number: item.item_number || '',
      upc: item.upc || '',
      cost: item.cost || '',
      quantity_size: item.quantity_size || '',
      vendor_cost: item.vendor_cost || '',
      category_id: item.category_id || ''
    });
    setEditId(item.id);
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
      const res = await fetch(`${API_URL}/items/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting item");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-orange-50 border border-orange-100 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-50 border-t-orange-500 rounded-full animate-spin" />
              <Boxes className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Synchronizing Product Catalog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Product Item</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage master inventory units & pricing parameters.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({
              description_name: '', price: '', description: '',
              item_number: '', upc: '', cost: '', quantity_size: '', vendor_cost: '',
              category_id: ''
            });
            setShowModal(true);
          }}
          className="bg-orange-500 shadow-sm shadow-orange-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Product Item
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/50 backdrop-blur-sm rounded-2xl w-fit border border-gray-100 shadow-sm">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === 'All' 
            ? 'bg-orange-500 text-white shadow-md' 
            : 'text-slate-500 hover:bg-white hover:text-slate-900'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === cat.name
              ? 'bg-orange-500 text-white shadow-md' 
              : 'text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow"
            />
          </div>
          {searchTerm && (
            <span className="ml-4 text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
              Found {filteredItems.length} results
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Description</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Item #</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Size / Qty</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Unit Cost</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Vendor Cost</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">SRP</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Category</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems
                .map(i => (
                  <tr key={i.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-1 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{i.description_name}</span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider">UPC: {i.upc || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-[11px] text-gray-700 font-mono font-bold tracking-wider">{i.item_number}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-xs text-gray-500 font-medium">{i.quantity_size || '—'}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-500">$ {parseFloat(i.cost || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-500">$ {parseFloat(i.vendor_cost || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600">$ {parseFloat(i.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      i.category_name 
                      ? 'bg-indigo-50 text-indigo-500 border-indigo-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {i.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(i)}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        title="Edit Node"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(i.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove Object"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && !loading && (
            <div className="p-16 text-center flex flex-col items-center">
              <Package className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Empty Catalog</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Synchronize your system by establishing your core item nomenclature matrix.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 text-orange-600 font-semibold hover:underline"
              >
                Initialize master item
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
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Package className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {isEdit ? 'Update Item Matrix' : 'Manage Product Node'}
                </h2>
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Product Nomenclature</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Standard Description</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-medium outline-none" placeholder="e.g. Premium Lager" required
                        value={formData.description_name} onChange={e => setFormData({ ...formData, description_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Quantity and Size</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-medium outline-none" placeholder="ex: 12 pack 16 oz"
                        value={formData.quantity_size} onChange={e => setFormData({ ...formData, quantity_size: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Category</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-medium outline-none appearance-none cursor-pointer"
                        required
                        value={formData.category_id} 
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Financial Parameters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Global UPC</label>
                      <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-mono outline-none" placeholder="000000000000"
                        value={formData.upc} onChange={e => setFormData({ ...formData, upc: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Unit Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
                          <input type="number" step="0.01" className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-mono outline-none" placeholder="0.00"
                            value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Vendor Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
                          <input type="number" step="0.01" className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-mono outline-none" placeholder="0.00"
                            value={formData.vendor_cost} onChange={e => setFormData({ ...formData, vendor_cost: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">SRP</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
                          <input type="number" step="0.01" className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition text-sm font-mono outline-none" placeholder="0.00" required
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Internal System Notes</label>
                  <textarea className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 rounded-lg transition resize-none h-20 text-sm font-medium outline-none" placeholder="Detailed product specifications..."
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-500 rounded-lg hover:bg-gray-50 transition uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={submitting} className="px-8 py-2.5 bg-orange-600 text-white font-black rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-100 transition disabled:opacity-50 uppercase text-[10px] tracking-widest">
                  {submitting ? (isEdit ? 'Updating...' : 'Committing...') : (isEdit ? 'Update Record' : 'Commit Record')}
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
        title="Remove Catalog Entry"
        message="Are you sure you want to remove this item? This action is permanent and will affect all downstream inventory calculations."
      />
    </div>
  );
}
