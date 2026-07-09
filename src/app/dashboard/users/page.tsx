import DashboardLayoutClient from '../layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { User } from '@/types';
import UsersPageClient from './page-client';

export default async function UsersPage() {
  const supabase = await createSupabaseServerClient();
  let users: User[] = [];

  if (supabase) {
    const { data } = await supabase.from('profiles').select('*');
    users = (data || []).map((row: any) => ({ id: row.id, name: row.name, email: row.email, role: row.role, pin: '', createdAt: row.created_at }));
  }

  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <UsersPageClient initialUsers={users} />
    </DashboardLayoutClient>
  );
}
