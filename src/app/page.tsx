'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LayoutDashboard, ShoppingCart, Package, BarChart3, ScanBarcode, Armchair } from 'lucide-react';

const features = [
  {
    title: 'Smart Sales',
    description: 'Fast table-based checkout with barcode search, multiple payments, and instant receipts.',
    icon: ShoppingCart,
  },
  {
    title: 'Inventory',
    description: 'Manage products, categories, stock levels, and pricing from one clean dashboard.',
    icon: Package,
  },
  {
    title: 'Reports',
    description: 'Daily sales, revenue trends, and live metrics to help you make better decisions.',
    icon: BarChart3,
  },
  {
    title: 'Scanner',
    description: 'Scan barcodes quickly to add items, reduce errors, and speed up ordering.',
    icon: ScanBarcode,
  },
  {
    title: 'Tables',
    description: 'Visual table management for dine-in, takeaway, and reservations.',
    icon: Armchair,
  },
  {
    title: 'Kitchen Flow',
    description: 'Orders move from cart to kitchen to completion with clear status updates.',
    icon: LayoutDashboard,
  },
];

const stats = [
  { label: 'Orders served', value: '12K+' },
  { label: 'Active restaurants', value: '300+' },
  { label: 'Uptime', value: '99.9%' },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
              POS
            </div>
            <span className="text-lg font-semibold tracking-tight">Nearfood resto</span>
          </div>
          <a
            href="/auth/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Get Started
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden hero-gradient">
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="badge bg-blue-50 text-blue-700 border border-blue-100">
                  Built for modern restaurant teams
                </span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                  Run your restaurant <br />
                  <span className="text-blue-600">faster and smarter</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Orders, tables, inventory, reports, and kitchen flow — in one
                  polished POS experience designed for real service.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/auth/login"
                    className="inline-flex items-center justify-center bg-blue-600 text-white px-7 py-3 rounded-xl text-base font-medium hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200"
                  >
                    Open Dashboard
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center bg-white text-gray-900 border px-7 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors"
                  >
                    Explore features
                  </a>
                </div>
                <div className="flex gap-8 pt-2">
                  {stats.map(stat => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Order queue</p>
                      <p className="text-xl font-bold">Table 6</p>
                    </div>
                    <span className="badge bg-amber-100 text-amber-700">In kitchen</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">Gibson</p>
                        <p className="text-xs text-gray-500">1 Extra ice</p>
                      </div>
                      <p className="text-sm font-medium">$13.98</p>
                    </div>
                    <div className="flex items-center justify-between border rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">Soup of the day</p>
                        <p className="text-xs text-gray-500">Customize</p>
                      </div>
                      <p className="text-sm font-medium">$4.59</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>$112.53</span></div>
                    <div className="flex justify-between text-gray-600"><span>Tax (9.45%)</span><span>$14</span></div>
                    <div className="flex justify-between text-gray-600"><span>Discount (24%)</span><span>-$12.53</span></div>
                    <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>$100.44</span></div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2">
                    Send to kitchen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Everything you need to serve faster
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                From the front of house to the kitchen, Nearfood resto keeps your team aligned and your guests happy.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="bg-white border rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Nearfood resto. Built for restaurant teams.</p>
          <a href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Open dashboard →
          </a>
        </div>
      </footer>
    </div>
  );
}
