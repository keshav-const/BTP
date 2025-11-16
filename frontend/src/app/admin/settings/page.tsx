'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AuthGuard } from '@/middleware/auth-guard';
import { Settings } from 'lucide-react';

function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-2">
          Settings
        </h1>
        <p className="font-sans text-taupe-600 dark:text-taupe-400">
          Configure system settings
        </p>
      </div>

      <Card variant="elevated" className="p-12 text-center">
        <Settings className="w-16 h-16 text-taupe-400 mx-auto mb-4" />
        <p className="font-sans text-lg text-taupe-600 dark:text-taupe-400">
          Settings panel coming soon...
        </p>
      </Card>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AuthGuard adminOnly>
      <SettingsContent />
    </AuthGuard>
  );
}
