'use client';

import { useState } from 'react';
import type { Product, ProductCategory } from '@/types';
import { getProducts, saveProducts, getCategories, saveCategories, seedData } from '@/lib/store';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    seedData();
    return getProducts();
  });
  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    seedData();
    return getCategories();
  });
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    cost: '',
    stock: '',
    barcode: '',
    unit: 'piece',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', categoryId: categories[0]?.id || '', price: '', cost: '', stock: '', barcode: '', unit: 'piece' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editingProduct) {
      const updated = products.map(p =>
        p.id === editingProduct.id ? { ...p, ...formData, price: parseFloat(formData.price), cost: parseFloat(formData.cost), stock: parseInt(formData.stock), updatedAt: now } : p
      );
      saveProducts(updated);
      setProducts(updated);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        createdAt: now,
        updatedAt: now,
      };
      saveProducts([...products, newProduct]);
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      barcode: product.barcode || '',
      unit: product.unit,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const category: ProductCategory = {
      id: Date.now().toString(),
      name: newCategory.trim(),
    };
    saveCategories([...categories, category]);
    setCategories([...categories, category]);
    setNewCategory('');
    setShowCategoryForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-4 mb-6 space-y-4">
          <h2 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border rounded px-3 py-2" required />
            <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="border rounded px-3 py-2">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="border rounded px-3 py-2" required step="0.01" />
            <input type="number" placeholder="Cost" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} className="border rounded px-3 py-2" required step="0.01" />
            <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="border rounded px-3 py-2" required />
            <input placeholder="Barcode" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} className="border rounded px-3 py-2" />
            <input placeholder="Unit" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingProduct ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      {showCategoryForm && (
        <div className="bg-white border rounded p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Add Category</h2>
          <div className="flex gap-4">
            <input placeholder="Category Name" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="border rounded px-3 py-2 flex-1" />
            <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            <button onClick={() => setShowCategoryForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Cost</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.name}{product.barcode && <span className="text-xs text-gray-400 block">{product.barcode}</span>}</td>
                <td className="px-4 py-2">{categories.find(c => c.id === product.categoryId)?.name}</td>
                <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="px-4 py-2">${product.cost.toFixed(2)}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
