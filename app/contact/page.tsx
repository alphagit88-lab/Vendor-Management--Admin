'use client';

import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

export default function ContactPage() {
  return (
    <div className={`min-h-screen bg-[#f5efe7] text-[#112033] ${spaceGrotesk.variable} font-sans`}>
      <LandingNavbar />

      <main className="pt-32">
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#c86c49]">
                  Get in Touch
                </p>
                <h1 className="mt-6 font-[family:var(--font-space-grotesk)] text-5xl font-bold tracking-[-0.06em] text-[#0d1b2b] sm:text-7xl">
                  Ready to Upgrade?
                </h1>
                <p className="mt-8 text-lg leading-8 text-[#5b6778]">
                  Contact us today for a professional consultation. We'll help you design the perfect beverage program tailored for your fast-paced retail environment.
                </p>

                <div className="mt-12 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-[#c86c49]">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#5b6778]">Call Us</p>
                      <p className="text-xl font-bold text-[#0d1b2b]">(800) COLD-FIRE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-[#5f9ea0]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#5b6778]">Email Us</p>
                      <p className="text-xl font-bold text-[#0d1b2b]">hello@coldfirecoffee.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-[#0d1b2b]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#5b6778]">Visit Us</p>
                      <p className="text-xl font-bold text-[#0d1b2b]">Houston, Texas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[3rem] bg-white p-8 shadow-2xl sm:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-10 rounded-full bg-[#ead2c3] flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-[#c86c49]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0d1b2b]">Consultation Request</h3>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5b6778]">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full rounded-2xl border-none bg-[#f5efe7] px-5 py-4 text-sm focus:ring-2 focus:ring-[#c86c49]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5b6778]">Business Name</label>
                      <input type="text" placeholder="Star C-Store" className="w-full rounded-2xl border-none bg-[#f5efe7] px-5 py-4 text-sm focus:ring-2 focus:ring-[#c86c49]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5b6778]">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full rounded-2xl border-none bg-[#f5efe7] px-5 py-4 text-sm focus:ring-2 focus:ring-[#c86c49]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5b6778]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your needs..." className="w-full rounded-2xl border-none bg-[#f5efe7] px-5 py-4 text-sm focus:ring-2 focus:ring-[#c86c49] resize-none" />
                  </div>
                  <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c86c49] py-5 text-base font-bold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                    Submit Request
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
