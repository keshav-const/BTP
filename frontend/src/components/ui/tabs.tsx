'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-taupe-200 dark:border-taupe-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'font-sans px-6 py-4 text-base font-medium transition-all duration-300 relative',
              'hover:text-gold-600 dark:hover:text-gold-400',
              activeTab === tab.id
                ? 'text-gold-600 dark:text-gold-400'
                : 'text-charcoal-600 dark:text-cream-200'
            )}
          >
            {tab.label}
            {/* Gold underline for active tab */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold animate-slide-in-left" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content with fade-in animation */}
      <div className="animate-fade-in">
        {activeTabData?.content}
      </div>
    </div>
  );
}
