import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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

// Color Input with Advanced Picker
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'picker' | 'palette'>('picker');
  const [opacity, setOpacity] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Parse current color and extract opacity if it's rgba/hsla
  const parseColor = (colorStr: string) => {
    let baseColor = colorStr;
    let alpha = 1;
    
    // Check if it's rgba format
    if (colorStr.startsWith('rgba(')) {
      const match = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        baseColor = rgbToHex(r, g, b);
        alpha = parseFloat(match[4]);
      }
    } 
    // Check if it's hsla format
    else if (colorStr.startsWith('hsla(')) {
      const match = colorStr.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        const rgb = hslToRgb(h, s, l);
        baseColor = rgbToHex(rgb.r, rgb.g, rgb.b);
        alpha = parseFloat(match[4]);
      }
    }
    // Check if it's rgb format
    else if (colorStr.startsWith('rgb(')) {
      const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        baseColor = rgbToHex(r, g, b);
      }
    }
    // If it's already hex or unknown format, use as is
    else if (colorStr.startsWith('#')) {
      baseColor = colorStr;
    }
    // Fallback to white if we can't parse it
    else {
      baseColor = '#ffffff';
    }
    
    return { baseColor, alpha };
  };

  const { baseColor, alpha } = parseColor(value);

  // Get current color values - use the helper functions
  const rgb = hexToRgb(baseColor) || { r: 255, g: 255, b: 255 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Initialize opacity from current value
  useEffect(() => {
    setOpacity(alpha);
  }, [alpha]);

  // Handle opacity change
  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    const rgbColor = hexToRgb(baseColor) || { r: 255, g: 255, b: 255 };
    
    if (newOpacity === 1) {
      // Use hex format for full opacity
      onChange(baseColor);
    } else {
      // Use rgba format for partial opacity
      onChange(`rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${newOpacity})`);
    }
  };

  // Handle color change while preserving opacity
  const handleColorChange = (newHex: string) => {
    if (opacity === 1) {
      onChange(newHex);
    } else {
      const rgbColor = hexToRgb(newHex) || { r: 255, g: 255, b: 255 };
      onChange(`rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`);
    }
  };

  // Draw color picker canvas - simplified and fast
  const drawColorPicker = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple and fast gradient approach
    ctx.clearRect(0, 0, 240, 140);
    
    // Base hue color
    ctx.fillStyle = `hsl(${hsl.h}, 100%, 50%)`;
    ctx.fillRect(0, 0, 240, 140);
    
    // White to transparent (saturation)
    const satGrad = ctx.createLinearGradient(0, 0, 240, 0);
    satGrad.addColorStop(0, 'rgba(255,255,255,1)');
    satGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = satGrad;
    ctx.fillRect(0, 0, 240, 140);
    
    // Black overlay (lightness)
    const lightGrad = ctx.createLinearGradient(0, 0, 0, 140);
    lightGrad.addColorStop(0, 'rgba(0,0,0,0)');
    lightGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, 240, 140);
  }, [hsl.h]);

  // Draw hue slider - simplified and fast
  const drawHueSlider = useCallback(() => {
    const canvas = hueRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 240, 16);
    
    const grad = ctx.createLinearGradient(0, 0, 240, 0);
    grad.addColorStop(0, '#ff0000');
    grad.addColorStop(0.17, '#ffff00');
    grad.addColorStop(0.33, '#00ff00');
    grad.addColorStop(0.5, '#00ffff');
    grad.addColorStop(0.67, '#0000ff');
    grad.addColorStop(0.83, '#ff00ff');
    grad.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 240, 16);
  }, []);

  // Draw immediately when opened
  useEffect(() => {
    if (isOpen) {
      drawColorPicker();
      drawHueSlider();
    }
  }, [isOpen, drawColorPicker, drawHueSlider]);

  // Handle canvas clicks
  const handleColorPickerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const saturation = (x / rect.width) * 100;
    const lightness = 100 - (y / rect.height) * 100;
    
    const newRgb = hslToRgb(hsl.h, saturation, lightness);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleColorChange(newHex);
  };

  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hue = (x / rect.width) * 360;
    
    const newRgb = hslToRgb(hue, hsl.s, hsl.l);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleColorChange(newHex);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Common color palette for quick selection
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#c0c0c0', '#808080',
    '#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff', '#ffcc99', '#cc99ff',
    '#ff6666', '#66ff66', '#6666ff', '#ffff66', '#ff66ff', '#66ffff', '#ff9966', '#9966ff',
    '#ff3333', '#33ff33', '#3333ff', '#ffff33', '#ff33ff', '#33ffff', '#ff6633', '#6633ff',
    '#ff0033', '#33ff00', '#0033ff', '#ffff00', '#ff0099', '#00ffcc', '#ff3300', '#3300ff'
  ];

  return (
    <div className="space-y-2 relative">
      <Label className="text-xs font-medium leading-tight break-words">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-12 rounded-md border border-input cursor-pointer transition-all hover:scale-105 shadow-sm"
            style={{ backgroundColor: value }}
            ref={buttonRef}
          />
          {isOpen && (
            <div 
              className="fixed z-[9999] bg-white dark:bg-gray-800 border border-input rounded-lg shadow-xl p-3 w-72" 
              ref={colorPickerRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                top: (() => {
                  if (!buttonRef.current) return '50%';
                  const rect = buttonRef.current.getBoundingClientRect();
                  const pickerHeight = 350; // Reduced height
                  const bottomSpace = window.innerHeight - rect.bottom;
                  
                  if (bottomSpace >= pickerHeight) {
                    return rect.bottom + window.scrollY + 8;
                  }
                  return rect.top + window.scrollY - pickerHeight - 8;
                })(),
                left: (() => {
                  if (!buttonRef.current) return '50%';
                  const rect = buttonRef.current.getBoundingClientRect();
                  const pickerWidth = 288;
                  const rightSpace = window.innerWidth - rect.left;
                  
                  if (rightSpace >= pickerWidth) {
                    return rect.left + window.scrollX;
                  }
                  return rect.right + window.scrollX - pickerWidth;
                })(),
                maxHeight: '70vh',
                overflowY: 'auto'
              }}
            >
              {/* Tab Navigation */}
              <div className="flex gap-1 mb-3 bg-muted/30 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => setCurrentTab('picker')}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                    currentTab === 'picker' 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Picker
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('palette')}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                    currentTab === 'palette' 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Palette
                </button>
              </div>

              {currentTab === 'picker' ? (
                <div className="space-y-3">
                  {/* Color Picker Canvas */}
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={240}
                      height={140}
                      className="w-full h-32 border border-input rounded cursor-crosshair"
                      onClick={handleColorPickerClick}
                    />
                    {/* Current color indicator */}
                    <div 
                      className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1.5 -translate-y-1.5"
                      style={{
                        left: `${(hsl.s / 100) * 100}%`,
                        top: `${100 - (hsl.l / 100) * 100}%`,
                        backgroundColor: baseColor
                      }}
                    />
                  </div>

                  {/* Hue Slider */}
                  <div className="relative">
                    <canvas
                      ref={hueRef}
                      width={240}
                      height={16}
                      className="w-full h-4 border border-input rounded cursor-pointer"
                      onClick={handleHueClick}
                    />
                    {/* Hue indicator */}
                    <div 
                      className="absolute w-2 h-5 border-2 border-white rounded shadow-lg pointer-events-none transform -translate-x-1 -translate-y-0.5"
                      style={{
                        left: `${(hsl.h / 360) * 100}%`,
                        backgroundColor: `hsl(${hsl.h}, 100%, 50%)`
                      }}
                    />
                  </div>

                  {/* Opacity Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Opacity</Label>
                      <span className="text-xs text-muted-foreground">{Math.round(opacity * 100)}%</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        style={{
                          background: `linear-gradient(to right, transparent 0%, ${baseColor} 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Color Palette */
                <div className="grid grid-cols-6 gap-1.5">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-7 h-7 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color,
                        borderColor: baseColor === color ? '#3b82f6' : '#e5e7eb'
                      }}
                      onClick={() => {
                        handleColorChange(color);
                        setIsOpen(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              )}

              {/* Hex Input */}
              <div className="pt-2 mt-2 border-t border-border">
                <Label className="text-xs font-medium mb-1 block">Hex</Label>
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    let newValue = e.target.value;
                    if (!newValue.startsWith('#')) newValue = '#' + newValue;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                      handleColorChange(newValue);
                    }
                  }}
                  className="h-6 text-xs font-mono"
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
            // Allow rgba, hsla, or hex input
            if (newValue.startsWith('#') || newValue.startsWith('rgb') || newValue.startsWith('hsl')) {
              onChange(newValue);
            }
          }}
          className="h-8 text-xs flex-1 font-mono"
          placeholder="#000000 or rgba(...)"
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
}) => {
  const handleChange = (newValue: string) => {
    // Allow empty string during typing
    if (newValue === '') {
      return;
    }
    
    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      // Allow any value within bounds, including 0
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If empty, set to minimum value (which could be 0)
    if (inputValue === '' || inputValue === null || inputValue === undefined) {
      onChange(min);
      return;
    }
    
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      // Ensure value is within bounds - this properly handles 0
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    } else {
      // If invalid input, reset to current value
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace to get to 0 or empty
    if (e.key === 'Backspace' || e.key === 'Delete') {
      return;
    }
    
    // Prevent invalid characters
    if (!/[0-9\.]/.test(e.key) && !['ArrowUp', 'ArrowDown', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs font-medium leading-tight break-words">{label}</Label>}
      <Input
        type="number"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-8 text-xs"
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

// SelectInput Component
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