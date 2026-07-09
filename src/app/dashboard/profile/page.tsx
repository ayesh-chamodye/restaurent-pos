import DashboardLayoutClient from '../layout-client';
import ProfilePageClient from './page-client';

export default async function ProfilePage() {
  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <ProfilePageClient initialUser={{ name: '', email: '' }} />
    </DashboardLayoutClient>
  );
}
