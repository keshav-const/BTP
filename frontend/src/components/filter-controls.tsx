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
        <Card key={filter.name} variant="outlined" className="p-4">
          <button
            onClick={() => toggleFilter(filter.name)}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-semibold text-foreground">{filter.name}</h3>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-secondary-600 transition-transform',
                expandedFilters.has(filter.name) && 'rotate-180'
              )}
            />
          </button>

          {expandedFilters.has(filter.name) && (
            <div className="space-y-2">
              {filter.options.map((option) => {
                const isSelected = filter.multiple
                  ? (selectedFilters[filter.name] as string[])?.includes(option.value)
                  : selectedFilters[filter.name] === option.value;

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <input
                      type={filter.multiple ? 'checkbox' : 'radio'}
                      checked={isSelected}
                      onChange={() =>
                        handleOptionChange(filter.name, option.value, filter.multiple)
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-foreground">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-secondary-500">({option.count})</span>
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
