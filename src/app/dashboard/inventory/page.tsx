'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState({ name: '', category_id: '', price: 0, cost: 0, stock: 0, unit: 'piece', barcode: '' });

  const load = async () => {
    if (!supabase) return;
    const { data: prods } = await supabase.from('products').select('*').order('name');
    setProducts(prods || []);
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setCategories(cats || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    await supabase.from('products').insert({ ...form, id: crypto.randomUUID().slice(0, 8) });
    setForm({ name: '', category_id: '', price: 0, cost: 0, stock: 0, unit: 'piece', barcode: '' });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      <form onSubmit={add} className="bg-white border rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border rounded-xl px-3 py-2" required />
        <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="border rounded-xl px-3 py-2">
          <option value="">Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="border rounded-xl px-3 py-2" />
        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="border rounded-xl px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white rounded-xl px-4 py-2 col-span-full md:col-span-1">Add</button>
      </form>
      <div className="bg-white border rounded-2xl divide-y">
        {products.map(p => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-gray-500">{categories.find(c => c.id === p.categoryId)?.name || '—'} • ${p.price.toFixed(2)}</p>
            </div>
            <span className="text-sm text-gray-600">Stock: {p.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
