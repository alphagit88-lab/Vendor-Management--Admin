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
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="font-[family:var(--font-space-grotesk)] text-2xl font-semibold tracking-[-0.05em]">
              ColdFire Coffee
            </p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/74">
              Premium roasts and professional equipment solutions for retail and fast-paced environments.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Why ColdFire Coffee?</p>
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

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Access</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/76">
              Ready to upgrade your station?
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#c86c49] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
            >
              Partner Access
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/52">
          Copyright {currentYear} ColdFire Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
