'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Armchair,
  Package,
  ScanBarcode,
  BarChart3,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Order queue', icon: ClipboardList },
  { href: '/dashboard/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/dashboard/tables', label: 'Tables', icon: Armchair },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/scanner', label: 'Scanner', icon: ScanBarcode },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayoutClient({
  children,
  user,
  orderCount,
  tableCount,
  reservationCount,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string };
  orderCount: number;
  tableCount: number;
  reservationCount: number;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">Nearfood resto</h2>
          <p className="text-xs text-gray-500 mt-1">Inventory</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
          <p className="text-xs text-gray-500 mb-2">{user.role}</p>
          <button onClick={handleLogout} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 inline-flex items-center justify-center gap-2">
            <LogOut size={16} /> Logout
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
