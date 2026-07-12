'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const demoOrders = [
  { id: 'ORD-001', table_number: 3, status: 'preparing', items: [{ product: { id: 'p1', name: 'Gibson', price: 13.98, stock: 50, categoryId: 'c1', barcode: '12345', unit: 'piece', cost: 6.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 2 }], total: 28.5, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'ORD-002', table_number: 6, status: 'ready', items: [{ product: { id: 'p2', name: 'Soup of the day', price: 4.59, stock: 20, categoryId: 'c2', barcode: '12346', unit: 'bowl', cost: 2.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 1 }], total: 14.0, created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: 'ORD-003', table_number: 2, status: 'pending', items: [{ product: { id: 'p3', name: 'Caesar Salad', price: 18.5, stock: 35, categoryId: 'c1', barcode: '12347', unit: 'plate', cost: 7.0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, quantity: 1 }], total: 18.5, created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

export default function DashboardHomePage() {
  const [finished, setFinished] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [expected, setExpected] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        const data = demoOrders;
        setFinished(data.filter(o => o.status === 'completed').length);
        setOngoing(data.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length);
        setExpected(Number(data.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)));
        return;
      }
      const { data: orders } = await supabase.from('orders').select('status,total');
      const f = orders?.filter(o => o.status === 'completed').length || 0;
      const o = orders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length || 0;
      const e = orders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
      setFinished(f);
      setOngoing(o);
      setExpected(Number(e.toFixed(2)));
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Revenue stats</h1>
        <p className="text-sm text-gray-500">Client-side rendered • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Finished</p>
            <span className="badge bg-green-100 text-green-700">↑12,5%</span>
          </div>
          <p className="text-2xl font-bold">{finished}</p>
          <p className="text-xs text-gray-400">orders completed</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Ongoing</p>
            <span className="badge bg-amber-100 text-amber-700">↑1,05%</span>
          </div>
          <p className="text-2xl font-bold">{ongoing}</p>
          <p className="text-xs text-gray-400">active orders</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Expected</p>
            <span className="badge bg-green-100 text-green-700">↑0,25%</span>
          </div>
          <p className="text-2xl font-bold">${expected}</p>
          <p className="text-xs text-gray-400">revenue</p>
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Revenue overview</h3>
        <div className="h-64 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}
