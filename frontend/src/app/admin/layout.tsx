import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import AdminShell from './_components/admin-shell';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

async function fetchCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  if (!payload?.success || !payload?.data) {
    return null;
  }

  return payload.data;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login?redirect=/admin');
  }

  const user = await fetchCurrentUser(token);

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (user.role !== 'admin') {
    redirect('/');
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
