import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './route';

export async function requireServerAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }
  return session;
}
