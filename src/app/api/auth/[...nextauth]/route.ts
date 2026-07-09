import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';
import type { Session, User } from 'next-auth';

const encrypt = (text: string) => crypto.createHash('sha256').update(text).digest('hex');

const users = [
  { id: '1', name: 'Admin User', email: 'admin@pos.com', role: 'admin', password: encrypt('admin123') },
  { id: '2', name: 'John Cashier', email: 'john@pos.com', role: 'cashier', password: encrypt('cashier123') },
];

const findUser = (email: string) => users.find(u => u.email === email);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = findUser(credentials.email);
        if (!user || user.password !== encrypt(credentials.password)) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role } as User;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
