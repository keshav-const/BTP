'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks';
import { cn } from '@/utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, remove } = useToast();

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-info" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  };

  const bgMap = {
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border animate-slide-down',
            bgMap[toast.type]
          )}
        >
          {iconMap[toast.type]}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{toast.message}</p>
          </div>
          <button
            onClick={() => remove(toast.id)}
            className="text-secondary-500 hover:text-secondary-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
