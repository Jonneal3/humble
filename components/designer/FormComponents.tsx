import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";
import { fontOptions, loadGoogleFont, getFontsByCategory, fontCategories } from "@/types/design";

// Add styles for opacity slider
const sliderStyles = `
  .slider {
    background: linear-gradient(to right, 
      rgba(255,255,255,0) 0%, 
      rgba(0,0,0,1) 100%);
  }
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #666;
    cursor: pointer;
  }
  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #666;
    cursor: pointer;
  }
`;

// Inject styles into head
if (typeof document !== 'undefined' && !document.getElementById('opacity-slider-styles')) {
  const style = document.createElement('style');
  style.id = 'opacity-slider-styles';
  style.textContent = sliderStyles;
  document.head.appendChild(style);
}

// Color presets for the color picker
const colorPresets = [
  '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280',
  '#374151', '#1f2937', '#111827', '#000000', '#dc2626', '#ea580c',
  '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0891b2',
  '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#a21caf', '#be185d'
];

// Debounce hook for better performance
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Helper functions for color conversions
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Simple Color Input - Real-time updates for designer
export const ColorInput = ({ 
  label, 
  value, 
  onChange,
  showHex = true,
  showOpacity = false,
  className = "" 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  showHex?: boolean;
  showOpacity?: boolean;
  className?: string;
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Parse current color and opacity
  const parseColorValue = (colorValue: string) => {
    if (colorValue.startsWith('rgba(')) {
      const matches = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (matches) {
        const [, r, g, b, a] = matches;
        const hex = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
        return { hex, opacity: a ? parseFloat(a) : 1 };
      }
    }
    return { hex: colorValue, opacity: 1 };
  };

  const { hex: currentHex, opacity: currentOpacity } = parseColorValue(localValue);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Calculate optimal dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 200; // min-w-[200px]
      const viewportWidth = window.innerWidth;
      const sidebarWidth = 320; // w-80 = 320px
      
      // Check if there's enough space on the right
      const spaceOnRight = sidebarWidth - (buttonRect.left + buttonRect.width);
      const spaceOnLeft = buttonRect.left;
      
      // Position dropdown to the left if there's not enough space on the right
      if (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) {
        setDropdownPosition('right'); // This will use right-0 to position from the right edge
      } else {
        setDropdownPosition('left');
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const updateColor = (newHex: string, newOpacity: number = currentOpacity) => {
    let newValue: string;
    if (showOpacity && newOpacity < 1) {
      // Convert hex to RGB for rgba format
      const rgb = hexToRgb(newHex);
      if (rgb) {
        newValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${newOpacity})`;
      } else {
        newValue = newHex;
      }
    } else {
      newValue = newHex;
    }
    
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleColorChange = (newColor: string) => {
    updateColor(newColor, currentOpacity);
  };

  const handleOpacityChange = (newOpacity: number) => {
    updateColor(currentHex, newOpacity);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-F]{0,6}$/i.test(hex)) {
      setLocalValue(hex);
      // Immediate update for real-time preview
      if (hex.length === 7) { // Only update when hex is complete
        updateColor(hex, currentOpacity);
      }
    }
  };

  // Get display color (for the color swatch)
  const displayColor = showOpacity && currentOpacity < 1 
    ? `rgba(${hexToRgb(currentHex)?.r || 0}, ${hexToRgb(currentHex)?.g || 0}, ${hexToRgb(currentHex)?.b || 0}, ${currentOpacity})`
    : currentHex;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 relative overflow-hidden"
          >
            {/* Checkerboard pattern for transparency */}
            {showOpacity && currentOpacity < 1 && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                   linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                   linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                   linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                }}
              />
            )}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: displayColor }}
            />
          </button>
          {isOpen && (
            <div 
              className={`absolute z-[9999] mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[200px] ${
                dropdownPosition === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              <div className="grid grid-cols-6 gap-1 mb-3">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      handleColorChange(color);
                      setIsOpen(false);
                    }}
                    className="w-6 h-6 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Custom Color</Label>
                  <input
                    type="color"
                    value={currentHex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-8 rounded border border-gray-300"
                  />
                </div>
                {showOpacity && (
                  <div>
                    <Label className="text-xs flex justify-between">
                      <span>Opacity</span>
                      <span>{Math.round(currentOpacity * 100)}%</span>
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={currentOpacity}
                      onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {showHex && (
          <Input
            type="text"
            value={showOpacity && currentOpacity < 1 ? localValue : currentHex}
            onChange={handleHexChange}
            placeholder={showOpacity ? "#000000 or rgba(...)" : "#000000"}
            className="h-9 w-20 text-xs font-mono flex-shrink-0"
            maxLength={showOpacity ? 25 : 7}
          />
        )}
      </div>
    </div>
  );
};

// NumberInput Component - Immediate updates for designer
export const NumberInput = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  placeholder,
  unit 
}: { 
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  unit?: string;
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string and valid number formats
    if (newValue === '' || /^-?\d*\.?\d*$/.test(newValue)) {
      setLocalValue(newValue);
      
      // Immediate update for valid numbers
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="text"
          value={localValue}
          onChange={handleChange}
          min={min}
          max={max}
          placeholder={placeholder}
          className="h-9 pr-8"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

// Enhanced Font Selector Component
interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle font selection
  const handleFontSelect = (fontFamily: string, fontWeight: string) => {
    // Load the Google Font dynamically
    loadGoogleFont(fontFamily, fontWeight);
    
    // Update the configuration
    onChange(fontFamily);
    setIsOpen(false);
  };

  // Load the current font if not already loaded
  useEffect(() => {
    if (value) {
      const currentFont = fontOptions.find(f => f.value === value);
      if (currentFont) {
        loadGoogleFont(currentFont.value, currentFont.weight);
      }
    }
  }, [value]);

  // Load fonts on hover for preview
  const handleFontHover = (fontFamily: string, fontWeight: string) => {
    loadGoogleFont(fontFamily, fontWeight);
  };

  return (
    <div className="space-y-2 relative">
      <Label className="text-xs font-medium leading-tight break-words">{label}</Label>
      
      {/* Font Selector Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs h-8 hover:bg-muted/50 transition-colors"
        style={{ fontFamily: value }}
      >
        <span className="truncate" style={{ fontFamily: value }}>{value || "Select font..."}</span>
        <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Simplified Font Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-input rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="py-1">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => handleFontSelect(font.value, font.weight)}
                onMouseEnter={() => handleFontHover(font.value, font.weight)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between ${
                  value === font.value ? 'bg-muted' : ''
                }`}
                style={{ fontFamily: font.value }}
              >
                <span 
                  className="font-medium truncate" 
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </span>
                <span 
                  className="text-lg text-muted-foreground ml-2 sample-text" 
                  style={{ fontFamily: font.value }}
                >
                  Aa
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple SelectInput Component (for non-fonts) - Immediate updates
export const SelectInput = ({ label, value, onChange, options }: {
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[];
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium leading-tight break-words">{label}</Label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)} // Immediate update
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

// TextInput Component - Debounced for typing
export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300); // Keep debouncing for text

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  return (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
};

// FontFamilySelector - Immediate updates for selection
export const FontFamilySelector = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const debouncedSearchTerm = useDebounce(searchTerm, 200); // Only debounce search
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate optimal dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = buttonRect.width; // Same width as button
      const viewportWidth = window.innerWidth;
      const sidebarWidth = 320; // w-80 = 320px
      
      // Check if there's enough space to keep it aligned properly
      const spaceOnRight = sidebarWidth - (buttonRect.left + buttonRect.width);
      const spaceOnLeft = buttonRect.left;
      
      // Keep it left-aligned by default since it's w-full, but adjust if needed
      if (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('left');
      }
    }
  }, [isOpen]);

  // Load font immediately when selection changes
  useEffect(() => {
    if (value && value !== 'inherit' && value !== 'sans-serif' && value !== 'serif') {
      loadGoogleFont(value);
    }
  }, [value]);

  const handleFontSelect = (fontFamily: string) => {
    onChange(fontFamily); // Immediate update
    setIsOpen(false);
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const getFilteredFonts = () => {
    let fonts = selectedCategory ? getFontsByCategory(selectedCategory) : fontOptions;
    
    if (debouncedSearchTerm) {
      fonts = fonts.filter(font => 
        font.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    return fonts.slice(0, 20); // Limit to 20 results for performance
  };

  const displayValue = value === 'inherit' ? 'Default' : value;

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label>{label}</Label>
      <div className="relative">
        <Button
          ref={buttonRef}
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between h-9 text-left font-normal"
          style={{ fontFamily: value !== 'inherit' ? value : 'inherit' }}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        
        {isOpen && (
          <div 
            className={`absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden ${
              dropdownPosition === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {/* Search and Categories */}
            <div className="p-3 border-b border-gray-200 space-y-2">
              <Input
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Debounced via debouncedSearchTerm
                className="h-8 text-sm"
              />
              
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedCategory === null 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {fontCategories.slice(1).map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedCategory === category.value 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font List */}
            <div className="max-h-48 overflow-y-auto">
              {getFilteredFonts().map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => handleFontSelect(font.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                    value === font.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
              {getFilteredFonts().length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No fonts found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SearchInput Component - Debounced for search functionality
export const SearchInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300); // Keep debouncing for search

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}; 