'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter);
      const { data } = await query;
      setOrders(data || []);
    };
    load();
  }, [filter]);

  const updateStatus = async (id: string, status: Order['status']) => {
    if (!supabase) return;
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order queue</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Dine in <b className="text-gray-900">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</b></span>
          <span>Take away <b className="text-gray-900">1</b></span>
          <span>Reservation <b className="text-gray-900">0</b></span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold">Order #{order.id}</p>
                <p className="text-xs text-gray-500">Table {order.table_number ?? '—'} • {new Date(order.created_at).toLocaleTimeString()}</p>
              </div>
              <span className={`badge ${order.status === 'ready' ? 'bg-blue-100 text-blue-700' : order.status === 'preparing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{order.items.length} items</p>
            <p className="text-xs text-gray-400 mb-4">{Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)} minutes ago</p>
            <div className="flex gap-2">
              {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm">Start preparing</button>}
              {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm">Mark ready</button>}
              {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm">Complete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
