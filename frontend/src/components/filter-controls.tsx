'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/utils/cn';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterCategory {
  name: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface FilterControlsProps {
  filters: FilterCategory[];
  selectedFilters: Record<string, string | string[]>;
  onFilterChange: (filterName: string, value: string | string[]) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(filters.map((f) => f.name))
  );

  const toggleFilter = (filterName: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterName)) {
      newExpanded.delete(filterName);
    } else {
      newExpanded.add(filterName);
    }
    setExpandedFilters(newExpanded);
  };

  const handleOptionChange = (filterName: string, value: string, multiple = false) => {
    if (multiple) {
      const currentValues = (selectedFilters[filterName] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      onFilterChange(filterName, newValues);
    } else {
      const currentValue = selectedFilters[filterName];
      const newValue = currentValue === value ? '' : value;
      onFilterChange(filterName, newValue);
    }
  };

  return (
    <div className="space-y-4">
      {filters.map((filter) => (
        <Card 
          key={filter.name} 
          variant="outlined" 
          className="p-5 bg-cream-100 dark:bg-charcoal-700 border-taupe-200 dark:border-charcoal-600 rounded-xl"
        >
          <button
            onClick={() => toggleFilter(filter.name)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="font-sans text-xs uppercase tracking-wider font-semibold text-charcoal-900 dark:text-cream-100">
              {filter.name}
            </h3>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-taupe-600 dark:text-taupe-400 transition-transform duration-300',
                expandedFilters.has(filter.name) && 'rotate-180'
              )}
            />
          </button>

          {expandedFilters.has(filter.name) && (
            <div className="space-y-3">
              {filter.options.map((option) => {
                const isSelected = filter.multiple
                  ? (selectedFilters[filter.name] as string[])?.includes(option.value)
                  : selectedFilters[filter.name] === option.value;

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type={filter.multiple ? 'checkbox' : 'radio'}
                        checked={isSelected}
                        onChange={() =>
                          handleOptionChange(filter.name, option.value, filter.multiple)
                        }
                        className="peer w-4 h-4 cursor-pointer appearance-none border-2 border-taupe-400 dark:border-taupe-500 rounded checked:border-gold-500 checked:bg-gold-500 transition-all duration-200"
                      />
                      <svg
                        className="absolute top-0 left-0 w-4 h-4 pointer-events-none hidden peer-checked:block text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8L6.5 11.5L13 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="flex-1 text-sm text-charcoal-800 dark:text-cream-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-200">
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span className="text-xs text-taupe-500 dark:text-taupe-400">
                        ({option.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
