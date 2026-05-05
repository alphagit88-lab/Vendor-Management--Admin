'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Equipment', href: '/#equipment' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d4160] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-[family:var(--font-space-grotesk)] text-2xl font-semibold tracking-[-0.05em]">
              Jenko Coffee
            </p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/74">
              Premium roasts and professional equipment solutions for retail and fast-paced environments.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Why Jenko Coffee?</p>
            <div className="mt-4 space-y-3 text-sm text-white/76">
              <p>Premium Quality Roasts.</p>
              <p>Reliable Equipment.</p>
              <p>Foot Traffic Growth.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Quick Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/52">
          Copyright {currentYear} Jenko Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
