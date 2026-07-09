import DashboardLayoutClient from '../layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Table } from '@/types';
import TablesPageClient from './page-client';

export default async function TablesPage() {
  const supabase = await createSupabaseServerClient();
  let tables: Table[] = [];

  if (supabase) {
    const { data } = await supabase.from('tables').select('*').order('number');
    tables = data || [];
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <TablesPageClient initialTables={tables} />
    </DashboardLayoutClient>
  );
}
