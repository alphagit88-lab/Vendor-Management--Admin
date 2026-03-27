"use client";
import { useState, useEffect } from 'react';
import { Plus, UserPlus, Search, MoreVertical, X } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
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
        setFormData({ name: '', phone: '', email: '', password: '', role: 'staff' });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage members and system access roles.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 shadow-sm shadow-indigo-200 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Members
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-4 px-6 text-slate-700">Member Info</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">System Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase ring-2 ring-white">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{u.phone}</span>
                      {u.email && <span className="text-xs text-slate-500 mt-0.5">{u.email}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 shadow-sm border border-transparent hover:border-gray-200 transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
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
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Provision New Staff</h2>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Legal Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition" placeholder="Jane Doe" required
                    value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition" placeholder="(555) 000-0000" required
                      value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition" placeholder="jane@company.com" 
                      value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Secure Temporary Password</label>
                  <input type="password" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition" placeholder="••••••••" required
                    value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition disabled:opacity-50">
                  {loading ? 'Provisioning...' : 'Provision Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
