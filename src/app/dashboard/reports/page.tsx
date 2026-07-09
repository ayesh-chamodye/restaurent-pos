'use client';

import { useState } from 'react';
import type { Order } from '@/types';
import { getOrders, seedData } from '@/lib/store';

export default function ReportsPage() {
  const [orders] = useState<Order[]>(() => {
    seedData();
    return getOrders();
  });
  const [filterDate, setFilterDate] = useState('');

  const filteredOrders = orders.filter(o => {
    if (!filterDate) return true;
    return o.createdAt.startsWith(filterDate);
  });

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const totalItems = filteredOrders.reduce((sum, o) => sum + o.items.reduce((s, item) => s + item.quantity, 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Date</label>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white border rounded p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white border rounded p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrdersCount}</p>
        </div>
        <div className="bg-white border rounded p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Items Sold</h3>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
      </div>
      <div className="bg-white border rounded">
        <h2 className="text-lg font-bold p-4 border-b">Recent Orders</h2>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Payment</th>
              <th className="px-4 py-2 text-left">Cashier</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice().reverse().map(order => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2 capitalize">{order.paymentMethod}</td>
                <td className="px-4 py-2">{order.cashierName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <p className="p-4 text-gray-500">No orders found</p>}
      </div>
    </div>
  );
}
