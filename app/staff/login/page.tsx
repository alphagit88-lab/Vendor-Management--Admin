"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Lock, Mail, UserCircle, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        if (data.user.role === 'staff' || data.user.role === 'admin') {
          router.push('/staff/dashboard');
        } else {
          setError('Access denied: Staff account required.');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50 font-sans">
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/50 to-slate-900 pointer-events-none" />
        <div className="z-10 max-w-lg px-8 flex flex-col items-center justify-center">
          <div className="w-32 h-32 relative p-2 bg-white rounded-3xl shadow-lg border border-slate-700/50">
            <div className="relative w-full h-full">
              <Image
                src="/logon.jpeg"
                alt="VendorOS"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-black mt-8 text-white uppercase tracking-tighter">Staff Portal</h1>
          <p className="text-lg text-slate-300 mt-4 mb-8 leading-relaxed text-center font-medium">
            Access your tools, manage your inventory, and grow your sales.
          </p>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-md mx-auto space-y-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-20 h-20 relative overflow-hidden p-2 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="relative w-full h-full">
                  <Image src="/logon.jpeg" alt="VendorOS" fill sizes="80px" className="object-contain" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Staff Sign-In</h2>
            <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-wider">Secure authentication required.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-wide">
                <span className="shrink-0 animate-pulse text-rose-400">●</span> {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter assigned email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform active:scale-95 uppercase tracking-widest"
            >
              {loading ? 'Validating...' : 'Unlock Workspace'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 VendorOS Management System
          </p>
        </div>
      </div>
    </div>
  );
}
