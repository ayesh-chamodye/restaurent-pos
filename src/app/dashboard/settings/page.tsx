import DashboardLayoutClient from '../layout-client';
import SettingsPageClient from './page-client';

export default async function SettingsPage() {
  return (
    <DashboardLayoutClient user={{ name: '', email: '', role: 'admin' }} orderCount={0} tableCount={0} reservationCount={0}>
      <SettingsPageClient />
    </DashboardLayoutClient>
  );
}
