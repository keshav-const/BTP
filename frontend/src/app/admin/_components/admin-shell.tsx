import React, { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AdminShellProps {
  children: ReactNode;
  user: User;
}

export default function AdminShell({ children, user }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
