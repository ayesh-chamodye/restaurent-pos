'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Table } from '@/types';

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selected, setSelected] = useState<Table | null>(null);
  const [status, setStatus] = useState<Table['status']>('available');

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('tables').select('*').order('number');
    setTables(data || []);
  };

  useEffect(() => { load(); }, []);

  const update = async (table: Table) => {
    if (!supabase) return;
    await supabase.from('tables').update({ status }).eq('id', table.id);
    setTables(prev => prev.map(t => t.id === table.id ? { ...t, status } : t));
    setSelected(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage tables</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map(table => (
          <div key={table.id} onClick={() => { setSelected(table); setStatus(table.status); }} className={`bg-white border rounded-2xl p-5 cursor-pointer hover:shadow-md ${table.status === 'available' ? 'border-green-200' : table.status === 'occupied' ? 'border-red-200' : 'border-amber-200'}`}>
            <p className="text-lg font-bold">Table {table.number}</p>
            <p className="text-sm text-gray-500">Capacity: {table.capacity}</p>
            <span className={`badge mt-2 ${table.status === 'available' ? 'bg-green-100 text-green-700' : table.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{table.status}</span>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Table {selected.number}</h3>
            <select value={status} onChange={e => setStatus(e.target.value as Table['status'])} className="w-full border rounded-lg px-3 py-2 mb-4">
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => update(selected)} className="flex-1 bg-blue-600 text-white rounded-lg py-2">Save</button>
              <button onClick={() => setSelected(null)} className="flex-1 border rounded-lg py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
