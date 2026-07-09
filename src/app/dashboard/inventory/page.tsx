import DashboardLayoutClient from '../layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Product, ProductCategory } from '@/types';
import InventoryPageClient from './page-client';

export default async function InventoryPage() {
  const supabase = await createSupabaseServerClient();
  let products: Product[] = [];
  let categories: ProductCategory[] = [];

  if (supabase) {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('categories').select('*').order('name'),
    ]);
    products = prods || [];
    categories = cats || [];
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <InventoryPageClient initialProducts={products} initialCategories={categories} />
    </DashboardLayoutClient>
  );
}
