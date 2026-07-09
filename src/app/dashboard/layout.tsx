'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import type { Order, Table } from '@/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/orders', label: 'Order queue', icon: '🧾' },
  { href: '/dashboard/sales', label: 'Sales', icon: '🛒' },
  { href: '/dashboard/tables', label: 'Tables', icon: '🪑' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '📦' },
  { href: '/dashboard/scanner', label: 'Scanner', icon: '📷' },
  { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      if (!supabase) return;
      const { count: oc } = await supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'completed').neq('status', 'cancelled');
      setOrderCount(oc || 0);
      if (!supabase) return;
      const { count: tc } = await supabase.from('tables').select('*', { count: 'exact', head: true });
      setTableCount(tc || 0);
      if (!supabase) return;
      const { count: rc } = await supabase.from('tables').select('*', { count: 'exact', head: true }).eq('status', 'reserved');
      setReservationCount(rc || 0);
    };
    load();
  }, [user]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">Nearfood resto</h2>
          <p className="text-xs text-gray-500 mt-1">Inventory</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize mb-2">{user.role}</p>
          <button onClick={handleLogout} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 overflow-auto">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              <span>Dine in <b className="text-gray-900">{orderCount}</b></span>
              <span>Take away <b className="text-gray-900">1</b></span>
              <span>Reservation <b className="text-gray-900">{reservationCount}</b></span>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
