'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Table } from '@/types';

const demoTables: Table[] = [
  { id: 't1', number: 1, capacity: 4, status: 'available', current_order_id: undefined, created_at: new Date().toISOString() },
  { id: 't2', number: 2, capacity: 4, status: 'occupied', current_order_id: 'ORD-003', created_at: new Date().toISOString() },
  { id: 't3', number: 3, capacity: 6, status: 'occupied', current_order_id: 'ORD-001', created_at: new Date().toISOString() },
  { id: 't4', number: 4, capacity: 2, status: 'available', current_order_id: undefined, created_at: new Date().toISOString() },
  { id: 't5', number: 5, capacity: 4, status: 'reserved', current_order_id: undefined, created_at: new Date().toISOString() },
  { id: 't6', number: 6, capacity: 6, status: 'occupied', current_order_id: 'ORD-002', created_at: new Date().toISOString() },
  { id: 't7', number: 7, capacity: 8, status: 'available', current_order_id: undefined, created_at: new Date().toISOString() },
  { id: 't8', number: 8, capacity: 2, status: 'available', current_order_id: undefined, created_at: new Date().toISOString() },
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(demoTables);
  const [selected, setSelected] = useState<Table | null>(null);
  const [status, setStatus] = useState<Table['status']>('available');
  const [showAdd, setShowAdd] = useState(false);
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('4');

  const load = async () => {
    if (!supabase) {
      setTables(demoTables);
      return;
    }
    const { data } = await supabase.from('tables').select('*').order('number');
    setTables(data || []);
  };

  useEffect(() => { load(); }, []);

  const update = async (table: Table) => {
    if (!supabase) {
      setTables(prev => prev.map(t => t.id === table.id ? { ...t, status } : t));
      setSelected(null);
      return;
    }
    await supabase.from('tables').update({ status }).eq('id', table.id);
    setTables(prev => prev.map(t => t.id === table.id ? { ...t, status } : t));
    setSelected(null);
  };

  const addTable = () => {
    const num = Number(number);
    const cap = Number(capacity);
    if (!num || !cap) return;
    const newTable: Table = {
      id: crypto.randomUUID(),
      number: num,
      capacity: cap,
      status: 'available',
      current_order_id: undefined,
      created_at: new Date().toISOString(),
    };
    setTables(prev => [...prev, newTable].sort((a, b) => a.number - b.number));
    setNumber('');
    setCapacity('4');
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage tables</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Add Table</button>
      </div>
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
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add Table</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input type="number" value={number} onChange={e => setNumber(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 9" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 4" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addTable} className="flex-1 bg-blue-600 text-white rounded-lg py-2">Add</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 border rounded-lg py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
