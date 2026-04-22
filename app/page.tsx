'use client';

import type { CSSProperties } from 'react';
import { startTransition, useEffect, useEffectEvent, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Printer,
  ScanLine,
  ShieldCheck,
  Truck,
  Waypoints,
  X,
} from 'lucide-react';
import image1 from '@/src/1.jpeg';
import image2 from '@/src/2.jpeg';
import image3 from '@/src/3.jpeg';
import image4 from '@/src/4.jpeg';
import image5 from '@/src/5.jpeg';
import image6 from '@/src/6.jpeg';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const themeVars: CSSProperties = {
  ['--landing-bg' as string]: '#f5efe7',
  ['--landing-surface' as string]: '#fffaf4',
  ['--landing-surface-strong' as string]: '#f1e6d7',
  ['--landing-ink' as string]: '#112033',
  ['--landing-muted' as string]: '#5b6778',
  ['--landing-brand' as string]: '#1d4160',
  ['--landing-brand-strong' as string]: '#0d1b2b',
  ['--landing-accent' as string]: '#c86c49',
  ['--landing-accent-soft' as string]: '#ead2c3',
  ['--landing-highlight' as string]: '#5f9ea0',
};

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Overview', href: '#overview' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Services', href: '#services' },
];

const heroSlides: Array<{
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  spotlight: string;
}> = [
  {
    eyebrow: 'Mobile Delivery Workflow',
    title: 'Faster Deliveries. Zero Errors.',
    description:
      'Scan, sync, and print invoices in seconds. Keep your drivers moving and your customers happy.',
    image: image1,
    alt: 'Delivery driver beside a stocked van holding a portable invoice printer.',
    spotlight: 'Portable printing at the curb',
  },
  {
    eyebrow: 'Smart Invoice Control',
    title: 'Invoicing Just Got Smarter.',
    description:
      'Streamline your deliveries with real-time data entry and instant on-site printing.',
    image: image6,
    alt: 'Portable invoice printer producing printed receipts beside a stack of invoices.',
    spotlight: 'Clear invoices the moment the stop is complete',
  },
  {
    eyebrow: 'Live Route Sync',
    title: 'Deliver. Sync. Print. Done.',
    description: 'Managing your supply chain has never been this simple.',
    image: image5,
    alt: 'Delivery team unloading a van while another worker updates stock from a handheld device.',
    spotlight: 'One flow for the van, the store, and the back office',
  },
];

const proofTags = [
  'Handheld scan capture',
  'Real-time delivery sync',
  'Portable invoice printing',
];

const overviewChecks = [
  'Capture stock movement as soon as cartons leave the van.',
  'Keep delivery data synced between drivers, stores, and admin instantly.',
  'Print clean invoices on-site without slowing the route down.',
  'Replace manual follow-up with one connected field workflow.',
];

const statCards = [
  {
    value: '03',
    label: 'Core actions',
    description: 'Scan stock, sync records, and print invoices in one route-ready loop.',
    icon: ScanLine,
  },
  {
    value: '06',
    label: 'Field touchpoints',
    description: 'From loading the van to shelf refill, every stop stays visible and connected.',
    icon: Waypoints,
  },
  {
    value: '01',
    label: 'Unified workflow',
    description: 'Drivers and admin work from the same delivery story instead of separate updates.',
    icon: Printer,
  },
];

const reasons = [
  {
    title: 'Scan once at the stop',
    description:
      'Drivers capture cartons, quantities, and changes on the spot so the paperwork starts accurate.',
  },
  {
    title: 'Sync without retyping',
    description:
      'Updates move straight into the workflow, which keeps operations aligned while the route is still active.',
  },
  {
    title: 'Print before pulling away',
    description:
      'Customers get a clear invoice immediately, which shortens handoff time and reduces follow-up friction.',
  },
];

const serviceCards = [
  {
    eyebrow: 'Step 01',
    title: 'Arrival Scanning',
    description:
      'Start each stop with clean quantity capture so the delivery record is right from the first tap.',
    image: image5,
    alt: 'Delivery team unloading a van and using handheld devices.',
    featured: false,
  },
  {
    eyebrow: 'Step 02',
    title: 'Shelf Refill Sync',
    description:
      'Move from delivery boxes to storefront shelves while the system keeps quantities and notes in sync.',
    image: image3,
    alt: 'Driver organizing snacks and supplies inside a convenience store aisle.',
    featured: false,
  },
  {
    eyebrow: 'Step 03',
    title: 'Invoice Review',
    description:
      'Confirm item details at the counter with a workflow that feels quicker and more reliable for both sides.',
    image: image2,
    alt: 'Two team members reviewing boxes and invoice paperwork inside a convenience store.',
    featured: false,
  },
  {
    eyebrow: 'Step 04',
    title: 'Instant Printout',
    description:
      'Finish every stop with a portable invoice printer that turns synced data into a clean customer copy.',
    image: image6,
    alt: 'Portable printer creating a printed invoice.',
    featured: true,
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const advanceSlide = useEffectEvent((direction: 1 | -1 = 1) => {
    startTransition(() => {
      setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
    });
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      advanceSlide(1);
    }, 6500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 720);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const currentYear = new Date().getFullYear();
  const currentSlide = heroSlides[activeSlide];

  return (
    <div
      style={themeVars}
      className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        [data-reveal] {
          opacity: 0;
          filter: blur(10px);
          transform: translate3d(0, 42px, 0) scale(0.98);
          transition:
            opacity 0.85s ease,
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.85s ease;
          will-change: opacity, transform, filter;
        }

        [data-reveal='left'] {
          transform: translate3d(-52px, 18px, 0) scale(0.98);
        }

        [data-reveal='right'] {
          transform: translate3d(52px, 18px, 0) scale(0.98);
        }

        [data-reveal='zoom'] {
          transform: scale(0.92);
        }

        [data-reveal].is-visible {
          opacity: 1;
          filter: blur(0);
          transform: translate3d(0, 0, 0) scale(1);
        }

        @keyframes heroContent {
          from {
            opacity: 0;
            transform: translate3d(0, 34px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .hero-copy {
          animation: heroContent 0.72s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          [data-reveal] {
            opacity: 1;
            filter: none;
            transform: none;
            transition: none;
          }

          .hero-copy {
            animation: none;
          }
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="bg-[var(--landing-brand-strong)] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/80">
              <ScanLine className="h-4 w-4 text-[var(--landing-highlight)]" />
              Real-time route invoicing for delivery teams
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/88 backdrop-blur md:flex">
              <Printer className="h-4 w-4 text-[var(--landing-accent)]" />
              On-site print ready
            </div>
          </div>
        </div>

        <div className="border-b border-black/5 bg-[rgba(255,250,244,0.92)] shadow-[0_12px_36px_rgba(16,32,51,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="#home" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <Image
                  src="/logo.jpeg"
                  alt="Vendor Management logo"
                  fill
                  sizes="48px"
                  priority
                  className="object-contain p-1.5"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-[family:var(--font-space-grotesk)] text-xl font-bold tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                  VendorFlow
                </p>
                <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-muted)]">
                  Delivery Invoice Admin
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--landing-muted)] transition hover:bg-[var(--landing-accent-soft)] hover:text-[var(--landing-brand-strong)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(200,108,73,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(200,108,73,0.34)]"
              >
                Login
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white text-[var(--landing-brand-strong)] shadow-sm lg:hidden"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen ? (
            <div className="border-t border-black/6 bg-[var(--landing-surface)] lg:hidden">
              <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--landing-brand-strong)] transition hover:bg-[var(--landing-surface-strong)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--landing-accent)] px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </nav>
            </div>
          ) : null}
        </div>
      </header>

      <main className="pt-[116px]">
        <section id="home" className="relative isolate overflow-hidden scroll-mt-32">
          <div className="relative min-h-[calc(100svh-116px)] bg-[var(--landing-brand-strong)]">
            <div className="absolute inset-0">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`absolute inset-0 transition-opacity duration-[1400ms] ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    placeholder="blur"
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                      index === activeSlide ? 'scale-100' : 'scale-[1.08]'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(200,108,73,0.30),transparent_18%),linear-gradient(90deg,rgba(10,17,28,0.94)_0%,rgba(10,17,28,0.80)_44%,rgba(10,17,28,0.36)_74%,rgba(10,17,28,0.58)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(95,158,160,0.16)_0%,transparent_26%,transparent_72%,rgba(10,17,28,0.62)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[36%] bg-[linear-gradient(180deg,rgba(29,65,96,0.18)_0%,rgba(29,65,96,0.02)_100%)]" />

            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 hidden h-[3.75rem] w-[3.75rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-white/16 md:inline-flex"
              onClick={() => advanceSlide(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 hidden h-[3.75rem] w-[3.75rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-white/16 md:inline-flex"
              onClick={() => advanceSlide(1)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid w-full gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                <div className="max-w-3xl">
                  <div key={currentSlide.title} className="hero-copy">
                    <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[var(--landing-accent-soft)]">
                      {currentSlide.eyebrow}
                    </p>
                    <h1 className="mt-6 max-w-[12ch] font-[family:var(--font-space-grotesk)] text-5xl font-bold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.35rem]">
                      {currentSlide.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                      {currentSlide.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.36)]"
                      >
                        Open Admin Login
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="#overview"
                        className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/14"
                      >
                        Explore Workflow
                      </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      {proofTags.map((tag) => (
                        <div
                          key={tag}
                          className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/82 backdrop-blur-sm"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="ml-auto max-w-md rounded-[2rem] border border-white/12 bg-white/10 p-6 text-white shadow-[0_28px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/58">
                      Field-ready promise
                    </p>
                    <p className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold leading-tight tracking-[-0.05em] text-white">
                      {currentSlide.spotlight}
                    </p>
                    <div className="mt-5 space-y-3 text-sm leading-7 text-white/76">
                      <div className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--landing-highlight)]" />
                        <span>Drivers move faster because paperwork happens at the stop, not after the route.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--landing-highlight)]" />
                        <span>Shared data reduces missed updates between delivery teams and the office.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-3 px-4">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-12 bg-white' : 'w-3 bg-white/35 hover:bg-white/55'
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="relative scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div data-reveal="left" className="relative min-h-[520px] sm:min-h-[620px]">
                <div className="absolute left-0 top-0 w-[62%] overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_30px_80px_rgba(17,32,51,0.10)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={image2}
                      alt="Delivery staff reviewing products and invoice paperwork inside a store."
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 26vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-[60%] overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_30px_80px_rgba(17,32,51,0.12)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={image4}
                      alt="Delivery worker standing beside a van with portable printer and stacked supplies."
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 25vw, 56vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute bottom-[9%] left-[8%] max-w-[16rem] rounded-[1.8rem] border border-[var(--landing-accent-soft)] bg-[var(--landing-surface)] p-5 shadow-[0_20px_50px_rgba(17,32,51,0.08)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-accent)]">
                    Route snapshot
                  </p>
                  <p className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                    Live print. Live sync.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">
                    Field teams can confirm, update, and print on-site without losing momentum.
                  </p>
                </div>
              </div>

              <div data-reveal="right">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                  Overview
                </p>
                <h2 className="mt-4 max-w-[13ch] font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                  Built for speed in the van and clarity at the counter.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                  This redesign keeps the sample's bold section rhythm, but the story now centers on delivery teams,
                  handheld scanning, synced route data, and portable invoice printing instead of the original site's
                  industry visuals and color treatment.
                </p>

                <div className="mt-8 grid gap-4">
                  {overviewChecks.map((item, index) => (
                    <div
                      key={item}
                      data-reveal="zoom"
                      style={{ transitionDelay: `${index * 100}ms` }}
                      className="flex items-start gap-4 rounded-[1.7rem] border border-black/6 bg-[rgba(255,250,244,0.85)] px-5 py-4 shadow-[0_16px_44px_rgba(17,32,51,0.05)] backdrop-blur-sm"
                    >
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-[var(--landing-muted)]">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(17,32,51,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-brand-strong)] text-white">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--landing-brand-strong)]">Driver-ready flow</p>
                        <p className="text-sm text-[var(--landing-muted)]">Unload, update, confirm.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(17,32,51,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-accent)] text-white">
                        <Printer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--landing-brand-strong)]">Customer-ready finish</p>
                        <p className="text-sm text-[var(--landing-muted)]">Printed proof before departure.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--landing-brand)] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-3">
              {statCards.map((card, index) => (
                <article
                  key={card.label}
                  data-reveal="zoom"
                  style={{ transitionDelay: `${index * 110}ms` }}
                  className="rounded-[2rem] border border-white/12 bg-white/5 p-8 shadow-[0_18px_46px_rgba(0,0,0,0.16)] backdrop-blur-sm"
                >
                  <card.icon className="h-8 w-8 text-[var(--landing-accent-soft)]" />
                  <p className="mt-6 font-[family:var(--font-space-grotesk)] text-6xl font-bold tracking-[-0.06em] text-white">
                    {card.value}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">{card.label}</p>
                  <p className="mt-2 max-w-[30ch] text-sm leading-7 text-white/72">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div data-reveal="left" className="relative overflow-hidden rounded-[2.4rem] border border-black/6 bg-[var(--landing-brand-strong)] shadow-[0_28px_80px_rgba(17,32,51,0.16)]">
                <div className="relative aspect-[5/6]">
                  <Image
                    src={image3}
                    alt="Driver arranging products and supplies inside a retail aisle."
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,43,0.04)_0%,rgba(13,27,43,0.64)_100%)]" />
                </div>
              </div>

              <div data-reveal="right">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                  Why Choose This Flow
                </p>
                <h2 className="mt-4 max-w-[12ch] font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                  A lighter field process with fewer slow handoffs.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                  The page now tells a cleaner product story: drivers scan quickly, updates stay synced, and every stop
                  can end with a customer-ready invoice.
                </p>

                <div className="mt-8 space-y-5">
                  {reasons.map((reason, index) => (
                    <div
                      key={reason.title}
                      data-reveal="right"
                      style={{ transitionDelay: `${index * 110}ms` }}
                      className="flex items-start gap-4 rounded-[1.8rem] border border-black/6 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(17,32,51,0.05)]"
                    >
                      <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent)] text-white shadow-[0_14px_32px_rgba(200,108,73,0.22)]">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--landing-brand-strong)]">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.9rem] border border-[var(--landing-accent-soft)] bg-[var(--landing-surface)] p-6 shadow-[0_18px_42px_rgba(17,32,51,0.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--landing-brand-strong)] text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--landing-brand-strong)]">Built to feel reliable on the route</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">
                        Every section supports the same promise: quicker stops, clearer records, and smoother delivery
                        proof at the point of service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-32 px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center" data-reveal="zoom">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                Delivery Steps
              </p>
              <h2 className="mt-4 font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                The page walks visitors through the flow in the same strong rhythm as the sample.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                Floating image cards, crisp spacing, and reveal animations keep the structure familiar while the content
                stays fully yours.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map((card, index) => (
                <div
                  key={card.title}
                  data-reveal="zoom"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="relative pt-12"
                >
                  <article className="group relative h-full rounded-[2.2rem] border border-black/6 bg-white px-7 pb-8 pt-16 text-center text-[var(--landing-brand-strong)] shadow-[0_24px_64px_rgba(17,32,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(29,65,96,0.4)] hover:bg-[linear-gradient(180deg,#1d4160_0%,#0d1b2b_100%)] hover:text-white hover:shadow-[0_30px_72px_rgba(13,27,43,0.18)]">
                    <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.6rem] border-4 border-[var(--landing-surface)] bg-white shadow-[0_18px_44px_rgba(17,32,51,0.12)]">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        placeholder="blur"
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <p
                      className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-accent)] transition-colors duration-300 group-hover:text-white/70"
                    >
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 font-[family:var(--font-space-grotesk)] text-3xl font-semibold leading-tight tracking-[-0.05em]">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--landing-muted)] transition-colors duration-300 group-hover:text-white/78">
                      {card.description}
                    </p>

                    <Link
                      href="/login"
                      className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--landing-surface)] px-5 py-3 text-sm font-semibold text-[var(--landing-brand-strong)] transition duration-300 hover:bg-[var(--landing-surface-strong)] group-hover:bg-white group-hover:text-[var(--landing-brand-strong)]"
                    >
                      Open workflow
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--landing-brand)] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="font-[family:var(--font-space-grotesk)] text-2xl font-semibold tracking-[-0.05em]">
                VendorFlow
              </p>
              <p className="mt-4 max-w-xs text-sm leading-7 text-white/74">
                A landing page shaped around mobile delivery invoicing, cleaner route updates, and fast customer-ready
                printouts.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Workflow</p>
              <div className="mt-4 space-y-3 text-sm text-white/76">
                <p>Scan stock at arrival.</p>
                <p>Sync quantities and notes.</p>
                <p>Print invoices before departure.</p>
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
                Ready to continue into the admin area? Jump straight into the current workspace.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
              >
                Go to Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/52">
            Copyright {currentYear} VendorFlow. Redesigned with your provided delivery and invoice visuals.
          </div>
        </div>
      </footer>

      {showTopButton ? (
        <button
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-50 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[var(--landing-accent)] text-white shadow-[0_20px_40px_rgba(200,108,73,0.34)] transition hover:-translate-y-1"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
