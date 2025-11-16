'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Clear auth token and redirect to login
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-charcoal-800 border-r border-taupe-200 dark:border-taupe-700 shadow-luxury transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-taupe-200 dark:border-taupe-700">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-charcoal-900" />
                </div>
                <span className="text-xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
                  Admin
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-taupe-600 hover:text-charcoal-900 dark:text-taupe-400 dark:hover:text-cream-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 font-sans text-base rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gold-100 text-gold-700 border-2 border-gold-400 shadow-luxury-sm dark:bg-gold-900/20 dark:text-gold-400'
                      : 'text-taupe-700 hover:bg-cream-200 hover:text-charcoal-900 dark:text-taupe-300 dark:hover:bg-charcoal-700 dark:hover:text-cream-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-taupe-200 dark:border-taupe-700">
            <div className="mb-4">
              <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400">
                Signed in as
              </p>
              <p className="font-sans font-semibold text-charcoal-900 dark:text-cream-100 truncate">
                {user.name || `${user.firstName} ${user.lastName}` || user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-charcoal-800 border-b border-taupe-200 dark:border-taupe-700 shadow-luxury-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-taupe-600 hover:text-charcoal-900 dark:text-taupe-400 dark:hover:text-cream-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
              Admin
            </span>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
