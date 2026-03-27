"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Lock, Phone } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 pointer-events-none" />
        <div className="z-10 max-w-lg px-8 flex flex-col items-center justify-center">
          <div className="w-full h-40 relative px-4">
            <Image 
              src="/logo.jpeg" 
              alt="VendorOS" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-lg text-slate-300 mt-8 mb-8 leading-relaxed text-center">
            The next-generation operations platform built for precision, speed, and absolute control.
          </p>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-full h-24 relative overflow-hidden px-4">
                <Image src="/logo.jpeg" alt="VendorOS" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-gray-500">Access your administrative workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                <span className="shrink-0 animate-pulse">●</span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter your registered phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Authenticating...' : 'Sign in securely'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
