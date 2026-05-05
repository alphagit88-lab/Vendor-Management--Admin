'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ScanLine, Printer, Coffee, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Equipment', href: '/#equipment' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[#0d1b2b] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/80">
            <Coffee className="h-4 w-4 text-[#5f9ea0]" />
            Premium coffee roasts & professional equipment
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/88 backdrop-blur md:flex">
            <Zap className="h-4 w-4 text-[#c86c49]" />
            Full-service distribution
          </div>
        </div>
      </div>

      <div className={`border-b border-black/5 transition-all duration-300 ${scrolled ? 'bg-[rgba(255,250,244,0.95)] shadow-lg py-2' : 'bg-[rgba(255,250,244,0.92)] py-4'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <Image
                src="/lgoNewWeb.jpeg"
                alt="ColdFire Coffee logo"
                fill
                sizes="48px"
                priority
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-[family:var(--font-space-grotesk)] text-xl font-bold tracking-[-0.05em] text-[#0d1b2b]">
                ColdFire Coffee
              </p>
              <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#5b6778]">
                Roasts. Equipment. Service.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#5b6778] transition hover:bg-[#ead2c3] hover:text-[#0d1b2b]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#c86c49] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(200,108,73,0.28)] transition hover:-translate-y-0.5"
            >
              Partner Login
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white text-[#0d1b2b] shadow-sm lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/6 bg-[#fffaf4] lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#0d1b2b] transition hover:bg-[#f1e6d7]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[#c86c49] px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Partner Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
