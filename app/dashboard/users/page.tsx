"use client";
import { useState, useEffect } from 'react';
import { Plus, UserPlus, Search, Edit, Trash2, X, Users, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', username: '', email: '', password: '', role: 'staff', inventory_location: '' });
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    // Exclude admins from the staff directory view
    if (u.role === 'admin') return false;

    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.inventory_location?.toLowerCase().includes(term)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `${API_URL}/users/${editId}` : `${API_URL}/users`;
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
        fetchUsers();
        setShowModal(false);
        setShowPassword(false);
        setFormData({ name: '', phone: '', username: '', email: '', password: '', role: 'staff', inventory_location: '' });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(isEdit ? "Error updating user" : "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      username: user.username || '',
      phone: user.phone,
      email: user.email || '',
      password: '',
      role: user.role,
      inventory_location: user.inventory_location || ''
    });
    setEditId(user.id);
    setIsEdit(true);
    setShowPassword(false);
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
      const res = await fetch(`${API_URL}/users/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-400 mx-auto">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-indigo-50 border border-indigo-100 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
              <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Assembling Team Matrix...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage members and system access roles.</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setShowPassword(false);
            setFormData({ name: '', phone: '', username: '', email: '', password: '', role: 'staff', inventory_location: '' });
            setShowModal(true);
          }}
          className="bg-indigo-600 shadow-sm shadow-indigo-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Members
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Staff Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Phone Number</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Email Address</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Location</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Date Joined</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700">{u.phone}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{u.email || '—'}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    {u.inventory_location ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{u.inventory_location}</span>
                        <span className="text-[10px] text-slate-400 font-bold italic">Mapped Location</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-300 italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="p-16 text-center flex flex-col items-center">
              <UserPlus className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No staff members yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Start building your team by adding members. They will receive access immediately.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 text-indigo-600 font-semibold hover:underline"
              >
                Add the first member
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
                {isEdit ? 'Update Personnel Record' : 'Provision New Staff'}
              </h2>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto font-medium">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition text-sm outline-none font-medium" placeholder="Jane Doe" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Email Address <span className="text-rose-500">*</span></label>
                    <input type="email" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition text-sm outline-none font-medium" placeholder="jane@company.com" required
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Phone</label>
                    <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition text-sm outline-none font-medium" placeholder="(555) 000-0000" required
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition text-sm outline-none font-medium" 
                    placeholder="e.g. Kandy, Colombo, Galle"
                    value={formData.inventory_location} 
                    onChange={e => setFormData({ ...formData, inventory_location: e.target.value })} 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">{isEdit ? 'Update Password' : 'Secure Temporary Password'}</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition text-sm outline-none font-mono" 
                      placeholder={isEdit ? "Enter new password to change..." : "••••••••"} 
                      required={!isEdit}
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-500 rounded-lg hover:bg-gray-50 transition uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition disabled:opacity-50 uppercase text-[10px] tracking-widest">
                  {loading ? (isEdit ? 'Updating...' : 'Provisioning...') : (isEdit ? 'Update Record' : 'Provision Account')}
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
        title="Revoke System Access"
        message="Are you sure you want to remove this member? This will immediately revoke their access to the management matrix."
      />
    </div>
  );
}
