'use client';

import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import { Coffee, Award, Zap, Check } from 'lucide-react';

// Images
import image1 from '@/src/sld1.jpeg';
import image2 from '@/src/sld2.jpeg';
import image3 from '@/src/sld3.jpeg';
import image4 from '@/src/sld1.jpeg';
import sld1 from '@/src/sld1.jpeg';
import sld2 from '@/src/sld2.jpeg';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const productLineup = [
  {
    title: 'Colombian',
    description: 'A classic, medium-bodied brew with a smooth finish. Perfect for all-day sipping.',
    image: sld1,
    tags: ['Classic', 'Medium-Body', 'Smooth'],
  },
  {
    title: 'Texas Pecan',
    description: 'A local favorite with rich, nutty undertones. Captures the spirit of the South.',
    image: image2,
    tags: ['Local Favorite', 'Nutty', 'Aromatic'],
  },
  {
    title: 'Dark Roast',
    description: 'Deep, bold, and intense for those who need a serious wake-up call.',
    image: sld2,
    tags: ['Bold', 'Intense', 'Dark'],
  },
  {
    title: 'Artisan Cappuccinos',
    description: 'Creamy, frothy, and available in a variety of seasonal and staple flavors.',
    image: image3,
    tags: ['Creamy', 'Versatile', 'Staff Pick'],
  },
];

export default function ProductsPage() {
  return (
    <div className={`min-h-screen bg-[#f5efe7] text-[#112033] ${spaceGrotesk.variable} font-sans`}>
      <LandingNavbar />

      <main className="pt-32">
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#c86c49]">
              Our Selection
            </p>
            <h1 className="mt-6 font-[family:var(--font-space-grotesk)] text-5xl font-bold tracking-[-0.06em] text-[#0d1b2b] sm:text-7xl">
              Premium Roasts & Flavors
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5b6778]">
              We believe that convenience should never compromise quality. Discover the blends that drive your morning foot traffic.
            </p>
          </div>

          <div className="mx-auto mt-20 grid max-w-7xl gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
            {productLineup.map((product, index) => (
              <div key={product.title} className="group overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition-all hover:-translate-y-2">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-[family:var(--font-space-grotesk)] text-xl font-bold text-[#0d1b2b]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#5b6778] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0d1b2b] px-4 py-24 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-[family:var(--font-space-grotesk)] text-4xl font-bold tracking-tight sm:text-5xl">
                  The Jenko Standard
                </h2>
                <div className="mt-10 space-y-8">
                  <div className="flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c86c49]">
                      <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Small Batch Consistency</h4>
                      <p className="mt-2 text-white/60">Every roast is monitored for precision and profile, ensuring your customers get the same great taste every time.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5f9ea0]">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Ethical Sourcing</h4>
                      <p className="mt-2 text-white/60">We partner with growers who share our commitment to sustainability and quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/10">
                <Image
                  src={image4}
                  alt="Quality assurance"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
