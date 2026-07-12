'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

const demoOrders: Order[] = [
  { id: 'ORD-001', table_number: 3, status: 'completed', items: [{ product: { id: 'p1', name: 'Gibson', price: 13.98, stock: 50, categoryId: 'c1', barcode: '12345', unit: 'piece', cost: 6.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 2 }], total: 28.5, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), subtotal: 27.96, tax: 2.64, discount: 0, payment_method: 'cash', created_by: 'admin', updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), customer_count: 2 },
  { id: 'ORD-002', table_number: 6, status: 'completed', items: [{ product: { id: 'p2', name: 'Soup of the day', price: 4.59, stock: 20, categoryId: 'c2', barcode: '12346', unit: 'bowl', cost: 2.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 1 }], total: 14.0, created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), subtotal: 13.77, tax: 1.3, discount: 0, payment_method: 'cash', created_by: 'admin', updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), customer_count: 1 },
  { id: 'ORD-003', table_number: 2, status: 'preparing', items: [{ product: { id: 'p3', name: 'Caesar Salad', price: 18.5, stock: 35, categoryId: 'c1', barcode: '12347', unit: 'plate', cost: 7.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 1 }], total: 18.5, created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), subtotal: 18.14, tax: 1.71, discount: 0, payment_method: 'cash', created_by: 'admin', updated_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), customer_count: 2 },
  { id: 'ORD-004', table_number: 5, status: 'ready', items: [{ product: { id: 'p4', name: 'Pasta Carbonara', price: 22.0, stock: 25, categoryId: 'c1', barcode: '12348', unit: 'plate', cost: 9.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 1 }], total: 22.0, created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(), subtotal: 21.56, tax: 2.04, discount: 0, payment_method: 'cash', created_by: 'admin', updated_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(), customer_count: 1 },
];

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setOrders(demoOrders);
        return;
      }
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(data || []);
    };
    load();
  }, []);

  const total = orders.reduce((s, o) => s + o.total, 0);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs text-gray-500">Finished</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs text-gray-500">Ongoing</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs text-gray-500">Expected</p>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Revenue</p>
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Daily sales</h3>
        <div className="h-48 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}
