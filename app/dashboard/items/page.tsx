"use client";
import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, X, Search, Layers } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    description_name: '', price: '', description: '', 
    item_number: '', upc: '', cost: '', quantity_size: '' 
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        fetchItems();
        setShowModal(false);
        setFormData({ 
          description_name: '', price: '', description: '', 
          item_number: '', upc: '', cost: '', quantity_size: '' 
        });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isEdit ? "Error updating item" : "Error adding item");
    } finally {
      setLoading(false);
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
      quantity_size: item.quantity_size || ''
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
        fetchItems();
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage master inventory units & pricing parameters.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({ 
              description_name: '', price: '', description: '', 
              item_number: '', upc: '', cost: '', quantity_size: '' 
            });
            setShowModal(true);
          }}
          className="bg-orange-500 shadow-sm shadow-orange-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Catalog Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search catalog SKUs..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Item #</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Size / Qty</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">Cost</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left">SRP</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.map(i => (
                <tr key={i.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{i.description_name}</span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider">UPC: {i.upc || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[11px] text-gray-700 font-mono font-bold tracking-wider">{i.item_number}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-gray-500 font-medium">{i.quantity_size || '—'}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-500">$ {parseFloat(i.cost || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600">$ {parseFloat(i.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
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

          {items.length === 0 && (
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
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Package className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {isEdit ? 'Update Item Matrix' : 'Catalog Item'}
                </h2>
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Product Description</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Standard Nomenclature / Description</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm" placeholder="e.g. Premium Lager" required
                      value={formData.description_name} onChange={e => setFormData({ ...formData, description_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Quantity and Size</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm" placeholder="ex: 12 pack 16 oz"
                      value={formData.quantity_size} onChange={e => setFormData({ ...formData, quantity_size: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Item Number (Internal)</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm" placeholder="Item #"
                      value={formData.item_number} onChange={e => setFormData({ ...formData, item_number: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identifiers & Logistics</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Global UPC</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm font-mono" placeholder="000000000000"
                      value={formData.upc} onChange={e => setFormData({ ...formData, upc: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Unit Cost (Puchase)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input type="number" step="0.01" className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm" placeholder="0.00"
                          value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Selling Price (SRP)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input type="number" step="0.01" className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition text-sm" placeholder="0.00" required
                          value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Additional System Parameters (Optional)</label>
                  <textarea className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-orange-500 rounded-xl transition resize-none h-20 text-sm" placeholder="Detailed product specifications..."
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-gray-50 transition">Suspend</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? (isEdit ? 'Updating...' : 'Committing...') : (isEdit ? 'Update Node' : 'Commit Node')}
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
