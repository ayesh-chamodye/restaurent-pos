'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
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
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              POS
            </div>
            <span className="text-lg font-semibold">Restaurant POS</span>
          </div>
          <a
            href="/auth/login"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Login
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Point of Sale for Modern Restaurants
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Manage orders, inventory, barcode scanning, and reports from one fast,
            reliable dashboard built for restaurant teams.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </a>
        </section>

        <section className="border-t bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Sales & Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Fast cart-based checkout with barcode search, multiple payment methods, and instant receipts.
                </p>
              </div>
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Inventory</h3>
                <p className="text-gray-600 text-sm">
                  Add, edit, and organize products and categories with live stock tracking.
                </p>
              </div>
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Reports & Scanner</h3>
                <p className="text-gray-600 text-sm">
                  View daily sales reports and scan barcodes quickly to add items to orders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          Restaurant POS System
        </div>
      </footer>
    </div>
  );
}
