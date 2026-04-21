import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Layers,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

const modules: Array<{
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  tone: string;
}> = [
  {
    title: 'User Management',
    description: 'Control admin and staff roles so each team can handle vendor operations with the right level of access.',
    eyebrow: 'Access Control',
    icon: Users,
    tone: 'from-sky-500/18 to-sky-500/5',
  },
  {
    title: 'Customer Records',
    description: 'Keep shops, customer details, and relationship data organized for day-to-day coordination.',
    eyebrow: 'Customer Data',
    icon: Store,
    tone: 'from-emerald-500/18 to-emerald-500/5',
  },
  {
    title: 'Product Items',
    description: 'Maintain the item catalog used for stock planning, order preparation, and reporting.',
    eyebrow: 'Catalog',
    icon: Package,
    tone: 'from-amber-500/20 to-amber-500/5',
  },
  {
    title: 'Categories',
    description: 'Organize goods into clear groups so teams can search, manage, and report on products faster.',
    eyebrow: 'Structure',
    icon: Layers,
    tone: 'from-fuchsia-500/18 to-fuchsia-500/5',
  },
  {
    title: 'Inventory Management',
    description: 'Monitor stock levels, movement history, and item availability across the full vendor operation.',
    eyebrow: 'Stock Visibility',
    icon: Boxes,
    tone: 'from-cyan-500/18 to-cyan-500/5',
  },
  {
    title: 'Distribution Orders',
    description: 'Create, dispatch, and track outgoing orders from request through fulfillment.',
    eyebrow: 'Order Flow',
    icon: ShoppingCart,
    tone: 'from-indigo-500/18 to-indigo-500/5',
  },
  {
    title: 'Reports',
    description: 'Review stock movement, customer activity, and operational performance in one reporting space.',
    eyebrow: 'Insights',
    icon: ClipboardList,
    tone: 'from-rose-500/18 to-rose-500/5',
  },
  {
    title: 'Staff Workspace',
    description: 'Support staff with a focused workspace for customer visits, stock handling, and order updates.',
    eyebrow: 'Staff Portal',
    icon: Workflow,
    tone: 'from-violet-500/18 to-violet-500/5',
  },
];

const proofStats = [
  { value: '8', label: 'Core admin areas' },
  { value: '4', label: 'Staff workspaces' },
  { value: '1', label: 'Connected platform' },
];

const benefits = [
  {
    title: 'Operational clarity',
    description: 'Show where customer records, stock control, orders, and reporting fit into daily work.',
  },
  {
    title: 'Connected workflows',
    description: 'Explain how catalog setup, inventory updates, and dispatch move through one connected process.',
  },
  {
    title: 'Team visibility',
    description: 'Make it clear how admin planning and staff execution stay aligned across the platform.',
  },
];

const showcaseCards = [
  {
    eyebrow: 'Operations Pulse',
    title: 'See stock, order status, and daily activity at a glance.',
    description: 'Frame the platform as a live operations center for customer service, stock control, and fulfillment.',
    imageSrc: '/landing/financial-graphs.jpg',
    alt: 'Laptop displaying reports and financial graphs on a desk.',
  },
  {
    eyebrow: 'Inventory Story',
    title: 'Show how items move from stock control to order fulfillment.',
    description: 'Help users understand how the item catalog, inventory tracking, and distribution process work together.',
    imageSrc: '/landing/warehouse-worker.jpg',
    alt: 'Warehouse worker organizing inventory in a storage area.',
  },
  {
    eyebrow: 'Team Coordination',
    title: 'Highlight how admin and staff stay aligned across daily work.',
    description: 'Show shared visibility for customer records, task execution, and performance follow-up on every screen size.',
    imageSrc: '/landing/forklift-operations.jpg',
    alt: 'Modern warehouse operations with staff and a forklift in motion.',
  },
];

const workflowSteps = [
  {
    title: 'Maintain customer and vendor records',
    description: 'Keep shop details, contacts, and business relationships ready for daily operations.',
  },
  {
    title: 'Track stock and prepare orders',
    description: 'Use item, category, and inventory data to plan replenishment and fulfill outgoing orders accurately.',
  },
  {
    title: 'Review reports and improve decisions',
    description: 'Follow activity trends, movement summaries, and operational results to guide the next actions.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6efe6] text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,216,200,0.85),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(211,237,232,0.95),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,239,230,0.5))]" />
        <div className="absolute inset-0 opacity-[0.38] [background-image:linear-gradient(rgba(20,36,49,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,36,49,0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_78%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-full border border-white/10 bg-[#081223]/78 shadow-[0_24px_70px_rgba(2,8,23,0.28)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-12 w-28 overflow-hidden rounded-2xl bg-white/90 p-1 shadow-sm">
                  <Image
                    src="/logo.jpeg"
                    alt="VendorOS"
                    fill
                    sizes="112px"
                    quality={95}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="text-lg font-semibold tracking-[0.12em] text-white">VENDOROS</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/70">
                    Vendor Management Admin
                  </p>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                <Link
                  href="#platform"
                  className="rounded-full px-4 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white"
                >
                  Platform
                </Link>
                <Link
                  href="#modules"
                  className="rounded-full px-4 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white"
                >
                  Modules
                </Link>
                <Link
                  href="#workflow"
                  className="rounded-full px-4 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white"
                >
                  Workflow
                </Link>
              </nav>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(255,255,255,0.16)] transition hover:bg-[#eef4ff]"
              >
                Access Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative isolate overflow-hidden bg-[#071427] pt-32 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,11,24,0.98)_0%,rgba(6,16,34,0.94)_35%,rgba(8,23,51,0.78)_70%,rgba(6,18,42,0.86)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(44,110,255,0.28),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(41,126,255,0.46),transparent_26%),radial-gradient(circle_at_90%_78%,rgba(19,74,221,0.3),transparent_24%)]" />
            <div className="absolute left-[-7rem] top-12 h-[24rem] w-[24rem] rounded-full bg-[#1a75d8]/24 blur-[120px]" />
            <div className="absolute right-[-6rem] top-24 h-[22rem] w-[22rem] rounded-full bg-[#36b3ff]/18 blur-[130px]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:160px_160px] [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-18 sm:pb-20 lg:px-8 lg:pb-24">
            <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8ec8ff]">
                  Vendor Management Platform
                </p>
                <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-[5.1rem]">
                  Run customers, inventory, orders, and reporting from one vendor operations hub.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
                  This page now explains what the system actually manages, from customer records and item setup
                  to stock monitoring, staff coordination, order fulfillment, and reporting.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1895f5,#1476e6_52%,#0f5fd2)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_20px_44px_rgba(20,118,230,0.34)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_52px_rgba(20,118,230,0.4)]"
                  >
                    Open Admin Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#platform"
                    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore System
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {proofStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_44px_rgba(3,9,23,0.18)] backdrop-blur"
                    >
                      <p className="text-3xl font-semibold tracking-tight text-white">{item.value}</p>
                      <p className="mt-2 text-sm text-white/68">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 text-sm text-white/74 sm:grid-cols-3">
                  <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec8ff]" />
                    <span>Customer and vendor record visibility</span>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec8ff]" />
                    <span>Inventory and order coordination</span>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec8ff]" />
                    <span>Reports that support daily decisions</span>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[560px] lg:min-h-[640px]">
                <div className="absolute left-0 top-10 w-[48%] overflow-hidden rounded-[1.8rem] border border-white/12 bg-white/10 shadow-[0_28px_60px_rgba(3,9,23,0.34)] backdrop-blur-sm">
                  <div className="relative aspect-[9/11]">
                    <Image
                      src="/landing/tablet-warehouse.jpg"
                      alt="Team member checking stock with a tablet inside a warehouse."
                      fill
                      sizes="(min-width: 1024px) 22vw, 40vw"
                      quality={95}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.1),rgba(4,11,24,0.7))]" />
                  </div>
                </div>

                <div className="absolute right-0 top-0 w-[58%] overflow-hidden rounded-[2rem] border border-white/12 bg-white/10 shadow-[0_30px_80px_rgba(3,9,23,0.34)]">
                  <div className="relative aspect-[10/11]">
                    <Image
                      src="/landing/warehouse-racks.jpg"
                      alt="High storage racks inside a warehouse facility."
                      fill
                      sizes="(min-width: 1024px) 28vw, 55vw"
                      quality={95}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.1),rgba(4,11,24,0.7))]" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-[16%] w-[68%] overflow-hidden rounded-[2rem] border border-white/12 bg-white/10 shadow-[0_30px_80px_rgba(3,9,23,0.38)]">
                  <div className="relative aspect-[13/10]">
                    <Image
                      src="/landing/warehouse-team.jpg"
                      alt="Warehouse staff working among stocked shelves."
                      fill
                      sizes="(min-width: 1024px) 32vw, 65vw"
                      quality={95}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.02),rgba(4,11,24,0.8))]" />
                  </div>
                </div>

                <div className="absolute bottom-12 left-0 max-w-[17rem] rounded-[1.75rem] border border-white/10 bg-[#081223]/82 p-5 shadow-[0_24px_70px_rgba(2,8,23,0.28)] backdrop-blur-xl">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#8ec8ff]">
                    Platform Preview
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
                    Customer records, stock flow, orders, and reporting in one connected system.
                  </h2>
                  <div className="mt-4 grid gap-2 text-sm text-white/74">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#5cc7a6]" />
                      <span>Customer and item control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#5cc7a6]" />
                      <span>Inventory and order tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#5cc7a6]" />
                      <span>Admin and staff coordination</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="pt-10 pb-14 sm:pt-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr] xl:items-stretch">
              <div className="flex h-full flex-col gap-5">
                <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-950 shadow-[0_28px_90px_rgba(20,36,49,0.18)]">
                  <div className="relative min-h-[360px] sm:min-h-[420px]">
                    <Image
                      src="/landing/analytics-laptop.jpg"
                      alt="Analytics dashboard displayed on a laptop screen."
                      fill
                      sizes="(min-width: 1024px) 36vw, 100vw"
                      quality={95}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,17,40,0.08),rgba(5,17,40,0.82))]" />
                    <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9ed1ff]">
                        System Overview
                      </p>
                      <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight text-white">
                        See the full vendor workflow at a glance.
                      </h2>
                      <p className="mt-3 max-w-lg text-sm leading-7 text-white/78 sm:text-base">
                        The first screen now introduces customer data, stock control, orders, and reporting in a clearer way.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-full rounded-[1.7rem] border border-[#ead8cb] bg-white/88 p-6 shadow-[0_18px_55px_rgba(20,36,49,0.06)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                      How It Works
                    </p>
                    <p className="mt-3 max-w-[16ch] text-xl font-semibold leading-tight text-slate-950">
                      One flow for records, stock, and orders.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Customer data, items, inventory, and dispatch stay connected throughout daily work.
                    </p>
                  </div>
                  <div className="h-full rounded-[1.7rem] border border-[#ead8cb] bg-[#fffaf6] p-6 shadow-[0_18px_55px_rgba(20,36,49,0.06)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Daily Visibility
                    </p>
                    <p className="mt-3 max-w-[15ch] text-xl font-semibold leading-tight text-slate-950">
                      Shared visibility for admin and staff.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Teams can quickly understand responsibilities, activity, and follow-up across the system.
                    </p>
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-[#d8d1c7] bg-slate-950 shadow-[0_24px_70px_rgba(20,36,49,0.12)]">
                  <div className="relative h-full min-h-[220px] xl:min-h-[320px]">
                    <Image
                      src="/landing/warehouse-worker.jpg"
                      alt="Warehouse worker reviewing stock updates and order preparation."
                      fill
                      sizes="(min-width: 1280px) 34vw, 100vw"
                      quality={95}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,32,0.88)_0%,rgba(5,14,32,0.64)_42%,rgba(5,14,32,0.3)_100%),linear-gradient(180deg,rgba(5,14,32,0.08)_0%,rgba(5,14,32,0.78)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/88 backdrop-blur-sm">
                        <Boxes className="h-3.5 w-3.5" />
                        Field Activity
                      </div>
                      <h3 className="mt-4 max-w-[18ch] text-2xl font-semibold leading-tight text-white">
                        Stock checks and order follow-up stay visible in one place.
                      </h3>
                      <p className="mt-3 max-w-[32rem] text-sm leading-7 text-white/78">
                        Teams can update availability, confirm movement, and keep fulfillment aligned without losing operational context.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/82">
                        <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                          Stock updates
                        </span>
                        <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                          Dispatch follow-up
                        </span>
                        <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                          Team coordination
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-full rounded-[2.25rem] border border-[#ead8cb] bg-white/78 p-6 shadow-[0_24px_70px_rgba(20,36,49,0.08)] backdrop-blur-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f77db]">
                  Why This Matters
                </p>
                <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:max-w-[14ch] sm:text-4xl lg:max-w-[15ch] lg:text-[3.25rem]">
                  A homepage that clearly shows how vendor operations work.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Users can quickly understand customer records, item setup, inventory control, order handling, and reporting without digging through the system first.
                </p>

                <div className="mt-8 grid gap-3">
                  {benefits.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-[1.7rem] border border-[#efe0d4] bg-[#fffaf7] px-5 py-4 shadow-[0_16px_42px_rgba(20,36,49,0.05)]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#1476e6]">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.95rem] border border-[#ead8cb] bg-[#fffaf6] p-5 shadow-[0_20px_55px_rgba(20,36,49,0.06)] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    System highlights
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex min-h-[72px] items-center gap-3 rounded-[1.35rem] border border-[#efe0d4] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#cc5b36]" />
                      <span>Roles and staff permissions</span>
                    </div>
                    <div className="flex min-h-[72px] items-center gap-3 rounded-[1.35rem] border border-[#efe0d4] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#cc5b36]" />
                      <span>Customer and item catalog</span>
                    </div>
                    <div className="flex min-h-[72px] items-center gap-3 rounded-[1.35rem] border border-[#efe0d4] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#cc5b36]" />
                      <span>Inventory and order tracking</span>
                    </div>
                    <div className="flex min-h-[72px] items-center gap-3 rounded-[1.35rem] border border-[#efe0d4] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#cc5b36]" />
                      <span>Operational reporting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f77db]">
                Core Modules
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Show the real working parts of the vendor management system.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                These sections help users understand what the platform manages and how the business flows from setup to fulfillment.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {modules.map((module) => (
                <article
                  key={module.title}
                  className="group relative overflow-hidden rounded-[1.9rem] border border-[#ead8cb] bg-white p-6 shadow-[0_18px_55px_rgba(20,36,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(20,118,230,0.12)]"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${module.tone} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#1476e6] transition group-hover:bg-white group-hover:text-slate-950">
                        <module.icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-700" />
                    </div>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                      {module.eyebrow}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                      {module.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#081322] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8ec8ff]">
                  System Workflow
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Show how the vendor management process moves from setup to action.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  This section describes the operational journey inside the platform so users can see how data becomes daily execution.
                </p>

                <div className="mt-8 space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-white/70">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {showcaseCards.map((card, index) => (
                  <article
                    key={card.title}
                    className={`group relative min-h-[26rem] overflow-hidden rounded-[2.1rem] bg-slate-900 shadow-[0_22px_70px_rgba(20,36,49,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_38px_110px_rgba(20,118,230,0.2)] ${
                      index === 2 ? 'md:col-span-2 xl:col-span-1' : ''
                    }`}
                  >
                    <Image
                      src={card.imageSrc}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1280px) 28vw, (min-width: 768px) 48vw, 100vw"
                      quality={95}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.08)_0%,rgba(4,11,24,0.3)_38%,rgba(4,11,24,0.88)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8ec8ff]">
                        {card.eyebrow}
                      </p>
                      <h3 className="mt-3 max-w-[14ch] text-2xl font-semibold leading-tight text-white">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/78">{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_top_left,#1b5fff_0%,#0f2d5a_34%,#081322_70%,#071427_100%)] shadow-[0_30px_90px_rgba(20,36,49,0.18)]">
            <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-12">
              <div className="flex flex-col justify-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8ec8ff]">
                  Vendor Operations
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Keep the homepage focused on how the system manages customers, stock, and orders.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
                  Users now get a clearer introduction to the platform, with messaging centered on business activity and operational visibility.
                </p>
                <div className="mt-8">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#eef4ff]"
                  >
                    Access Admin Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 self-center">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 text-white backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8ec8ff]">
                    Clear Scope
                  </p>
                  <p className="mt-3 text-lg font-semibold">A homepage that explains the platform's business functions.</p>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 text-white backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8ec8ff]">
                    Connected Data
                  </p>
                  <p className="mt-3 text-lg font-semibold">Customers, items, inventory, and orders stay part of one working story.</p>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 text-white backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8ec8ff]">
                    Daily Control
                  </p>
                  <p className="mt-3 text-lg font-semibold">Admins and staff can understand the system's role in daily operations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
