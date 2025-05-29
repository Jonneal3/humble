import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// ColorInput Component
export const ColorInput = ({ label, value, onChange }: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Simple color palette - organized and comprehensive
  const colorPalette = [
    // Grays & Blacks
    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
    // Reds
    '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2',
    // Oranges
    '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fff7ed',
    // Yellows
    '#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a', '#fefce8', '#fffbeb',
    // Greens
    '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4',
    // Blues
    '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#eff6ff', '#f0f9ff',
    // Purples
    '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e0e7ff', '#f3f4f6', '#faf5ff',
    // Pinks
    '#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3', '#fdf2f8'
  ];

  return (
    <div className="space-y-2 relative">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-12 rounded-md border border-input cursor-pointer transition-all hover:scale-105 shadow-sm"
            style={{ backgroundColor: value }}
          />
          {isOpen && (
            <div 
              className="absolute top-10 left-0 z-[9999] bg-white dark:bg-gray-800 border border-input rounded-lg shadow-xl p-3 w-72" 
              ref={colorPickerRef}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Color Grid */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: value === color ? '#3b82f6' : '#e5e7eb'
                    }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    title={color}
                  />
                ))}
              </div>

              {/* Hex Input */}
              <div className="pt-2 border-t border-border">
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    let newValue = e.target.value;
                    if (!newValue.startsWith('#')) newValue = '#' + newValue;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                      onChange(newValue);
                    }
                  }}
                  className="h-8 text-xs font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => {
            let newValue = e.target.value;
            if (!newValue.startsWith('#')) newValue = '#' + newValue;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
              onChange(newValue);
            }
          }}
          className="h-8 text-xs flex-1 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

// NumberInput Component
export const NumberInput = ({ label, value, onChange, min = 0, max = 100, step = 1 }: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void; 
  min?: number; 
  max?: number; 
  step?: number; 
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium">{label}</Label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 text-xs"
      min={min}
      max={max}
      step={step}
    />
  </div>
);

// SelectInput Component
export const SelectInput = ({ label, value, onChange, options }: {
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[];
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium">{label}</Label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
); 