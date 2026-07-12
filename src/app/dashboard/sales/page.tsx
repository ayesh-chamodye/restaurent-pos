'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductCategory, CartItem } from '@/types';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Minus, Trash2, Send, ChefHat, Package } from 'lucide-react';

const customizationOptions = [
  { id: 'extra_cheese', label: 'Extra cheese' },
  { id: 'no_onion', label: 'No onion' },
  { id: 'no_salt', label: 'No salt' },
  { id: 'extra_spice', label: 'Extra spice' },
  { id: 'extra_sauce', label: 'Extra sauce' },
];

export default function SalesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<{ id: string; number: number; status: string }[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tableId, setTableId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCount, setCustomerCount] = useState(2);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const [{ data: cats }, { data: prods }, { data: tbls }] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('products').select('*').gt('stock', 0).order('name'),
        supabase.from('tables').select('id,number,status').order('number'),
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
      setTables(tbls || []);
    };
    load();
  }, []);

  const filtered = categoryFilter === 'All' ? products : products.filter(p => p.categoryId === categoryFilter);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.0945;
  const total = Math.max(0, subtotal + tax - discount);

  const addToCart = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCustomizations([]);
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    setCart(prev => {
      const exists = prev.find(item => item.product.id === selectedProduct.id && JSON.stringify(item.customizations) === JSON.stringify(selectedCustomizations));
      if (exists) return prev.map(item => item.product.id === selectedProduct.id && JSON.stringify(item.customizations) === JSON.stringify(selectedCustomizations) ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product: selectedProduct, quantity: 1, customizations: selectedCustomizations }];
    });
    setSelectedProduct(null);
    setSelectedCustomizations([]);
  };

  const updateQty = (id: string, qty: number, customizations?: string[]) => {
    if (qty <= 0) return setCart(prev => prev.filter(item => !(item.product.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations))));
    setCart(prev => prev.map(item => item.product.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations) ? { ...item, quantity: qty } : item));
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
      customizations: ci.customizations || [],
    }));
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
    if (tableId) await supabase.from('tables').update({ status: 'occupied', current_order_id: orderId }).eq('id', tableId);
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
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-1">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Customize order</p>
              <div className="space-y-2 mb-4">
                {customizationOptions.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedCustomizations.includes(opt.label)} onChange={e => setSelectedCustomizations(prev => e.target.checked ? [...prev, opt.label] : prev.filter(x => x !== opt.label))} />
                    {opt.label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={confirmAddToCart} className="flex-1 bg-blue-600 text-white rounded-xl py-2">Add to cart</button>
                <button onClick={() => setSelectedProduct(null)} className="flex-1 border rounded-xl py-2">Cancel</button>
              </div>
            </div>
          </div>
        )}
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
            <div key={`${item.product.id}-${JSON.stringify(item.customizations)}`} className="border rounded-xl px-3 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  {item.customizations?.length ? <p className="text-xs text-gray-500">{item.customizations.join(', ')}</p> : null}
                  <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1, item.customizations)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1, item.customizations)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
                </div>
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
