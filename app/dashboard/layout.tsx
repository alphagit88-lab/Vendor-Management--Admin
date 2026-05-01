"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, Store, Package, LogOut, ChevronRight, UserCircle, ShoppingCart, Boxes, ClipboardList, Layers } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Decode JWT safely
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.name || 'Admin', role: payload.role || 'Admin' });
      } catch (e) { }
    }
  }, [router]);

  if (!mounted) return null;

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'Customers', href: '/dashboard/customers', icon: Store },
    { name: 'Product Items', href: '/dashboard/items', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: Layers },
    { name: 'Inventory Management', href: '/dashboard/inventory', icon: Boxes },
    { name: 'Distribution Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Reports', href: '/dashboard/reports', icon: ClipboardList },
  ];

  return (
    <div className="flex bg-gray-50/50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div>
          <div className="h-24 flex items-center justify-center px-4 border-b border-gray-200">
            <Link href="/dashboard" className="w-full">
              <div className="relative w-full h-16 bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-1">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.jpeg"
                    alt="VendorOS Logo"
                    fill
                    sizes="240px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className="px-4 py-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Core System</p>
            <nav className="flex flex-col gap-1.5 border-none">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-indigo-50/80 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-[15px] tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>{link.name}</span>
                    </div>
                    {isActive && <div className="w-1 h-4 bg-indigo-600 rounded-full" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50 bg-[#c9daff] m-4 rounded-lg">
          <div className="flex items-center gap-3 mb-4 px-2">
            <UserCircle className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{user?.name}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role} Unit</span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all duration-200 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto w-full text-slate-900 bg-[#FAFAFA]">
        <div className="p-8 max-w-400 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
