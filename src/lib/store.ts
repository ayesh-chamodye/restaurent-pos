import type { User, Product, ProductCategory, Order } from '@/types';
import { supabase } from '@/lib/supabase';

export function seedData() {}

export async function getUsers(): Promise<User[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('profiles').select('*');
  return (data || []).map((row: any) => ({ id: row.id, name: row.name, email: row.email, role: row.role, pin: '', createdAt: row.created_at } as User));
}

export async function getCategories(): Promise<ProductCategory[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('categories').select('*');
  return data || [];
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('products').select('*');
  return data || [];
}

export async function getOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('orders').select('*');
  return data || [];
}
