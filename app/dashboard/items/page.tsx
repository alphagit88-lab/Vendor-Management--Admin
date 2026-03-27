"use client";
import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, X, Search, MoreVertical, Layers } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
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
        setFormData({ name: '', price: '', description: '' });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error adding item");
    } finally {
      setLoading(false);
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
          onClick={() => setShowModal(true)}
          className="bg-orange-500 shadow-sm shadow-orange-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Catalog Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-4 px-6 text-slate-700 w-1/3">Item Nomenclature</th>
                <th className="py-4 px-6 w-1/6">Unit Rate ($)</th>
                <th className="py-4 px-6 w-1/3">System Attributes</th>
                <th className="py-4 px-6 text-right w-1/6">Modifiers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(i => (
                <tr key={i.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 tracking-tight">{i.name}</p>
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-0.5 font-mono">ID-{i.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-slate-400 font-medium">$</span>
                      <span className="text-xl font-bold tracking-tighter text-slate-800">{parseFloat(i.price).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {i.description || 'No system attributes configured for this module.'}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-transparent transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent transition-all">
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
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Package className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Catalog Item</h2>
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">Standard Nomenclature</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition" placeholder="e.g. Standard Processing Unit (Type B)" required
                    value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">Market Rate (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-medium">$</span>
                    </div>
                    <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition font-mono" placeholder="0.00" required
                      value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">System Object Parameters (Optional)</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition resize-none h-28 text-sm" placeholder="Define weight matrices, compliance codes, or routing parameters..."
                    value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-gray-50 transition">Suspend</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? 'Committing...' : 'Commit Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
