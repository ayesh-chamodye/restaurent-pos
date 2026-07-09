import DashboardLayoutClient from '../layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Product, ProductCategory } from '@/types';
import SalesPageClient from './page-client';

export default async function SalesPage() {
  const supabase = await createSupabaseServerClient();
  let categories: ProductCategory[] = [];
  let products: Product[] = [];
  let tables: { id: string; number: number; status: string }[] = [];

  if (supabase) {
    const [{ data: cats }, { data: prods }, { data: tbls }] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('products').select('*').gt('stock', 0).order('name'),
      supabase.from('tables').select('id,number,status').order('number'),
    ]);
    categories = cats || [];
    products = prods || [];
    tables = tbls || [];
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <SalesPageClient initialCategories={categories} initialProducts={products} initialTables={tables} />
    </DashboardLayoutClient>
  );
}
