"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X,Layers, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `${API_URL}/categories/${editId}` : `${API_URL}/categories`;
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
        fetchCategories();
        setShowModal(false);
        setFormData({ name: '', description: '' });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setFormData({ name: cat.name, description: cat.description || '' });
    setEditId(cat.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Items linked to it will become Uncategorized.')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      }
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-[34px] leading-tight font-black text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1 text-[15px] font-medium">Define the core classification hierarchy for your master catalog.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="bg-indigo-600 shadow-xl shadow-indigo-100 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm hover:bg-indigo-700 transition-all font-bold transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={() => handleEdit(cat)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{cat.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 min-h-10 leading-relaxed mb-6">
              {cat.description || 'No specialized parameters defined for this classification node.'}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
               <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                  System ID: <span className="font-mono text-slate-900 bg-slate-50 px-2 py-0.5 rounded">#{cat.id}</span>
               </span>
               <button onClick={() => handleEdit(cat)} className="text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Manage Node <ChevronRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <div className="p-5 bg-slate-50 rounded-full mb-4">
               <Layers className="w-12 h-12 text-slate-200" strokeWidth={1} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No categories found</h2>
            <p className="text-slate-400 text-[15px] mt-2 max-w-sm text-center">Your catalog items currently exist in a flat state. Initialize a parent category to establish hierarchy.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 flex justify-between items-center border-b border-gray-50">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {isEdit ? 'Refine Hierarchy' : 'Create Category'}
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Classification Management</p>
              </div>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Catalog Entry Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl transition-all text-sm font-bold" 
                    placeholder="e.g. Beverages, Construction, Safety..." 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Logic Specification</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl transition-all resize-none h-32 text-sm leading-relaxed" 
                    placeholder="Describe what items sit under this node..."
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
                <button type="submit" disabled={loading} className="flex-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? 'Committing...' : (isEdit ? 'Update Node' : 'Commit Node')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
