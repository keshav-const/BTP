'use client';

import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white dark:bg-charcoal-800 rounded-2xl shadow-luxury-xl',
          'w-full mx-4 max-h-[90vh] overflow-y-auto',
          'animate-scale-in',
          'border border-taupe-200 dark:border-charcoal-700',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-taupe-200 dark:border-charcoal-700">
            <h2 className="text-2xl font-serif font-semibold text-charcoal-900 dark:text-cream-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cream-200 dark:hover:bg-charcoal-700 rounded-xl transition-all duration-300 hover:rotate-90"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-taupe-600 dark:text-taupe-400" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
