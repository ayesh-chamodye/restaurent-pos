'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductCategory, CartItem, Order } from '@/types';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Minus, Trash2, Send, ChefHat, Package } from 'lucide-react';

export default function SalesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tableId, setTableId] = useState('');
  const [tables, setTables] = useState<{id:string; number:number; status:string}[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerCount, setCustomerCount] = useState(2);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const { data: cats } = await supabase.from('categories').select('*');
      setCategories(cats || []);
      const { data: prods } = await supabase.from('products').select('*').gt('stock', 0).order('name');
      setProducts(prods || []);
      const { data: tbls } = await supabase.from('tables').select('id,number,status').order('number');
      setTables(tbls || []);
    };
    load();
  }, []);

  const filtered = categoryFilter === 'All' ? products : products.filter(p => p.categoryId === categoryFilter);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.0945;
  const total = Math.max(0, subtotal + tax - discount);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return setCart(prev => prev.filter(item => item.product.id !== id));
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: qty } : item));
  };

  const sendToKitchen = async () => {
    if (cart.length === 0 || !supabase) return;
    setSubmitting(true);
    const orderId = crypto.randomUUID().slice(0, 8).toUpperCase();
    const items = cart.map(ci => ({
      product_id: ci.product.id,
      product_name: ci.product.name,
      quantity: ci.quantity,
      unit_price: ci.product.price,
      customizations: {},
    }));
    if (!supabase) return;
    const orderPayload = {
      id: orderId,
      table_id: tableId || null,
      table_number: tableId ? Number(tables.find(t => t.id === tableId)?.number) || null : null,
      customer_name: customerName || null,
      customer_count: customerCount,
      items,
      subtotal,
      tax,
      discount,
      total,
      payment_method: 'cash',
      status: 'preparing',
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('orders').insert(orderPayload);
    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }
    if (tableId && supabase) await supabase.from('tables').update({ status: 'occupied', current_order_id: orderId }).eq('id', tableId);
    setCart([]);
    setDiscount(0);
    setCustomerName('');
    setSubmitting(false);
    router.push('/dashboard/orders');
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-full text-sm border ${categoryFilter === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}`}>{cat}</button>
          ))}
          <span className="ml-auto text-sm text-gray-500">{filtered.length} items</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white border rounded-2xl p-4 hover:shadow-md transition cursor-pointer" onClick={() => addToCart(product)}>
              <div className="h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-400">
                <Package size={32} />
              </div>
              <h3 className="font-semibold text-sm">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-900 font-medium">${product.price.toFixed(2)}</p>
                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[420px] bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Table {tableId ? tables.find(t => t.id === tableId)?.number || '' : '—'}</h2>
              <div className="flex gap-2">
                <button className="border rounded-lg p-2 text-gray-600"><Search size={16} /></button>
                <button className="border rounded-lg p-2 text-gray-600"><Trash2 size={16} /></button>
              </div>
        </div>
        <select value={tableId} onChange={e => setTableId(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3">
          <option value="">Select table</option>
          {tables.map(t => <option key={t.id} value={t.id}>Table {t.number} ({t.status})</option>)}
        </select>
        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="w-full border rounded-lg px-3 py-2 mb-3" />
        <div className="space-y-3 mb-4">
          {cart.map(item => (
            <div key={item.product.id} className="flex items-center justify-between border rounded-xl px-3 py-3">
              <div>
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax (9.45%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Discount (%)</span><input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)} className="w-20 border rounded px-2 py-1 text-right" /></div>
          <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <button onClick={sendToKitchen} disabled={!cart.length || submitting} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-300 inline-flex items-center justify-center gap-2">
          <ChefHat size={18} /> Send to kitchen
        </button>
      </div>
    </div>
  );
}
