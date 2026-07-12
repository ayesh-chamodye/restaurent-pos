'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
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
