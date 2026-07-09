'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Order, Table } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ finished: 0, ongoing: 0, expected: 0 });

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const { data: orders } = await supabase.from('orders').select('status,total');
      const finished = orders?.filter(o => o.status === 'completed').length || 0;
      const ongoing = orders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length || 0;
      const expected = orders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
      setStats({ finished, ongoing, expected: Number(expected.toFixed(2)) });
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Revenue stats</h1>
        <p className="text-sm text-gray-500">Wed, 9 July • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Finished</p>
            <span className="badge bg-green-100 text-green-700">↑0,2,5%</span>
          </div>
          <p className="text-2xl font-bold">${stats.finished}</p>
          <p className="text-xs text-gray-400">orders completed</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Ongoing</p>
            <span className="badge bg-green-100 text-green-700">↑1,05%</span>
          </div>
          <p className="text-2xl font-bold">{stats.ongoing}</p>
          <p className="text-xs text-gray-400">active orders</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Expected</p>
            <span className="badge bg-green-100 text-green-700">↑0,25%</span>
          </div>
          <p className="text-2xl font-bold">${stats.expected}</p>
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
