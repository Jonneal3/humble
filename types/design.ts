export type WidgetStyle = "modern" | "minimal" | "classic";
export type ShadowSize = "none" | "small" | "medium" | "large";
export type BorderStyle = "solid" | "dashed" | "dotted" | "gradient" | "none";

export interface DesignSettings {
  // Instance Information
  name?: string;
  description?: string;
  
  // Business Template Settings
  business_type?: string;
  template_style?: string;
  color_scheme?: string;
  
  // Brand Settings
  logo_url?: string;
  brand_name?: string;
  brand_color?: string;
  brand_font?: string;
  
  // Layout Settings
  widget_width?: number;
  widget_height?: number;
  widget_style?: WidgetStyle;
  padding?: number;
  gap?: number;
  
  // Border Settings
  border_radius?: number;
  border_width?: number;
  border_color?: string;
  border_style?: BorderStyle;
  border_gradient?: string;
  
  // Background Settings
  background_color?: string;
  background_gradient?: string;
  background_image?: string;
  background_blur?: number;
  background_opacity?: number;
  
  // Text Settings
  text_color?: string;
  text_size?: number;
  text_weight?: number;
  text_font?: string;
  text_shadow?: string;
  
  // Input Settings
  input_background?: string;
  input_text?: string;
  input_border?: string;
  input_radius?: number;
  input_padding?: number;
  input_shadow?: string;
  input_focus_ring?: string;
  
  // Button Settings
  button_background?: string;
  button_text?: string;
  button_border?: string;
  button_radius?: number;
  button_padding?: number;
  button_shadow?: string;
  button_hover_scale?: number;
  button_hover_glow?: string;
  
  // Upload Area Settings
  upload_background?: string;
  upload_text?: string;
  upload_border?: string;
  upload_radius?: number;
  upload_padding?: number;
  upload_icon_color?: string;
  upload_hover_effect?: string;
  
  // Prompt Settings
  prompt_border?: string;
  prompt_radius?: number;
  prompt_padding?: number;
  prompt_placeholder_color?: string;
  prompt_focus_ring?: string;
  
  // Sidebar Settings
  sidebar_text?: string;
  sidebar_border?: string;
  sidebar_background?: string;
  sidebar_width?: number;
  
  // Effects
  shadow?: ShadowSize;
  shadow_color?: string;
  glow_effect?: string;
  hover_effects?: string;
  transition_speed?: number;
  
  // Behavior
  auto_resize?: boolean;
  lazy_load?: boolean;
  scroll_to_top?: boolean;
  responsive?: boolean;
  allow_fullscreen?: boolean;
  
  // Advanced
  sandbox?: string;
  loading?: string;
  referrer_policy?: string;
  allow_transparency?: boolean;
  show_header?: boolean;
  custom_css?: string;
}

// Style presets for different widget styles
export const stylePresets: Record<WidgetStyle, Partial<DesignSettings>> = {
  modern: {
    border_radius: 12,
    border_width: 1,
    border_color: "#e5e7eb",
    shadow: "medium",
    padding: 20,
  },
  minimal: {
    border_radius: 4,
    border_width: 0,
    border_color: "transparent",
    shadow: "none",
    padding: 12,
  },
  classic: {
    border_radius: 0,
    border_width: 2,
    border_color: "#000000",
    shadow: "none",
    padding: 16,
  }
};

export const defaultDesignSettings: DesignSettings = {
  // Instance Information
  name: "",
  description: "",
  
  // Business Template Settings
  business_type: "",
  template_style: "",
  color_scheme: "brand",
  
  // Brand Settings
  logo_url: undefined,
  brand_name: "",
  brand_color: '#000000',
  brand_font: 'Inter',
  
  // Layout Settings
  widget_width: 100,
  widget_height: 600,
  widget_style: 'modern',
  padding: 16,
  border_radius: 8,
  border_width: 1,
  border_color: '#e2e8f0',
  background_color: '#ffffff',
  shadow: 'medium',
  
  // Behavior
  auto_resize: true,
  lazy_load: false,
  scroll_to_top: true,
  responsive: true,
  allow_fullscreen: true,
  
  // Advanced
  sandbox: 'allow-scripts allow-same-origin allow-forms',
  loading: 'lazy',
  referrer_policy: 'no-referrer-when-downgrade',
  allow_transparency: true,
  show_header: true,
};

export type DesignPreset = {
  background_color: string;
  text_color: string;
  input_background: string;
  input_text: string;
  input_border: string;
  button_background: string;
  button_text: string;
  button_border: string;
  prompt_border: string;
  upload_background: string;
  upload_text: string;
  upload_border: string;
  sidebar_text: string;
  sidebar_border: string;
};

export const designPresets: Record<string, DesignPreset> = {
  'modern-dark': {
    background_color: '#1a1a1a',
    text_color: '#ffffff',
    input_background: '#2d2d2d',
    input_text: '#ffffff',
    input_border: '#404040',
    button_background: '#3b82f6',
    button_text: '#ffffff',
    button_border: '#2563eb',
    prompt_border: '#404040',
    upload_background: '#2d2d2d',
    upload_text: '#ffffff',
    upload_border: '#404040',
    sidebar_text: '#a3a3a3',
    sidebar_border: '#404040'
  },
  'minimal-light': {
    background_color: '#ffffff',
    text_color: '#000000',
    input_background: '#f9fafb',
    input_text: '#1f2937',
    input_border: '#e5e7eb',
    button_background: '#f3f4f6',
    button_text: '#1f2937',
    button_border: '#e5e7eb',
    prompt_border: '#e5e7eb',
    upload_background: '#f9fafb',
    upload_text: '#4b5563',
    upload_border: '#e5e7eb',
    sidebar_text: '#6b7280',
    sidebar_border: '#e5e7eb'
  },
  'nature-inspired': {
    background_color: '#f0fdf4',
    text_color: '#064e3b',
    input_background: '#dcfce7',
    input_text: '#064e3b',
    input_border: '#86efac',
    button_background: '#22c55e',
    button_text: '#ffffff',
    button_border: '#16a34a',
    prompt_border: '#86efac',
    upload_background: '#dcfce7',
    upload_text: '#064e3b',
    upload_border: '#86efac',
    sidebar_text: '#15803d',
    sidebar_border: '#86efac'
  },
  'ocean-theme': {
    background_color: '#f0f9ff',
    text_color: '#075985',
    input_background: '#e0f2fe',
    input_text: '#075985',
    input_border: '#7dd3fc',
    button_background: '#0ea5e9',
    button_text: '#ffffff',
    button_border: '#0284c7',
    prompt_border: '#7dd3fc',
    upload_background: '#e0f2fe',
    upload_text: '#075985',
    upload_border: '#7dd3fc',
    sidebar_text: '#0369a1',
    sidebar_border: '#7dd3fc'
  },
  'sunset-vibes': {
    background_color: '#fff7ed',
    text_color: '#7c2d12',
    input_background: '#ffedd5',
    input_text: '#7c2d12',
    input_border: '#fdba74',
    button_background: '#f97316',
    button_text: '#ffffff',
    button_border: '#ea580c',
    prompt_border: '#fdba74',
    upload_background: '#ffedd5',
    upload_text: '#7c2d12',
    upload_border: '#fdba74',
    sidebar_text: '#9a3412',
    sidebar_border: '#fdba74'
  },
  'midnight-purple': {
    background_color: '#1e1b4b',
    text_color: '#e9d5ff',
    input_background: '#312e81',
    input_text: '#e9d5ff',
    input_border: '#6d28d9',
    button_background: '#8b5cf6',
    button_text: '#ffffff',
    button_border: '#7c3aed',
    prompt_border: '#6d28d9',
    upload_background: '#312e81',
    upload_text: '#e9d5ff',
    upload_border: '#6d28d9',
    sidebar_text: '#c4b5fd',
    sidebar_border: '#6d28d9'
  },
  'forest-mist': {
    background_color: '#f0fdf4',
    text_color: '#064e3b',
    input_background: '#dcfce7',
    input_text: '#064e3b',
    input_border: '#86efac',
    button_background: '#22c55e',
    button_text: '#ffffff',
    button_border: '#16a34a',
    prompt_border: '#86efac',
    upload_background: '#dcfce7',
    upload_text: '#064e3b',
    upload_border: '#86efac',
    sidebar_text: '#15803d',
    sidebar_border: '#86efac'
  },
  'desert-sand': {
    background_color: '#fef3c7',
    text_color: '#78350f',
    input_background: '#fde68a',
    input_text: '#78350f',
    input_border: '#fbbf24',
    button_background: '#d97706',
    button_text: '#ffffff',
    button_border: '#b45309',
    prompt_border: '#fbbf24',
    upload_background: '#fde68a',
    upload_text: '#78350f',
    upload_border: '#fbbf24',
    sidebar_text: '#92400e',
    sidebar_border: '#fbbf24'
  },
  'nordic-frost': {
    background_color: '#f8fafc',
    text_color: '#0f172a',
    input_background: '#f1f5f9',
    input_text: '#0f172a',
    input_border: '#cbd5e1',
    button_background: '#64748b',
    button_text: '#ffffff',
    button_border: '#475569',
    prompt_border: '#cbd5e1',
    upload_background: '#f1f5f9',
    upload_text: '#0f172a',
    upload_border: '#cbd5e1',
    sidebar_text: '#334155',
    sidebar_border: '#cbd5e1'
  },
  'cherry-blossom': {
    background_color: '#fdf2f8',
    text_color: '#831843',
    input_background: '#fce7f3',
    input_text: '#831843',
    input_border: '#f9a8d4',
    button_background: '#ec4899',
    button_text: '#ffffff',
    button_border: '#db2777',
    prompt_border: '#f9a8d4',
    upload_background: '#fce7f3',
    upload_text: '#831843',
    upload_border: '#f9a8d4',
    sidebar_text: '#be185d',
    sidebar_border: '#f9a8d4'
  },
  'cyberpunk': {
    background_color: '#0f172a',
    text_color: '#38bdf8',
    input_background: '#1e293b',
    input_text: '#38bdf8',
    input_border: '#0ea5e9',
    button_background: '#f472b6',
    button_text: '#ffffff',
    button_border: '#ec4899',
    prompt_border: '#0ea5e9',
    upload_background: '#1e293b',
    upload_text: '#38bdf8',
    upload_border: '#0ea5e9',
    sidebar_text: '#7dd3fc',
    sidebar_border: '#0ea5e9'
  },
  'lavender-dreams': {
    background_color: '#faf5ff',
    text_color: '#6b21a8',
    input_background: '#f3e8ff',
    input_text: '#6b21a8',
    input_border: '#d8b4fe',
    button_background: '#a855f7',
    button_text: '#ffffff',
    button_border: '#9333ea',
    prompt_border: '#d8b4fe',
    upload_background: '#f3e8ff',
    upload_text: '#6b21a8',
    upload_border: '#d8b4fe',
    sidebar_text: '#7e22ce',
    sidebar_border: '#d8b4fe'
  },
  'autumn-breeze': {
    background_color: '#fff7ed',
    text_color: '#7c2d12',
    input_background: '#ffedd5',
    input_text: '#7c2d12',
    input_border: '#fdba74',
    button_background: '#f97316',
    button_text: '#ffffff',
    button_border: '#ea580c',
    prompt_border: '#fdba74',
    upload_background: '#ffedd5',
    upload_text: '#7c2d12',
    upload_border: '#fdba74',
    sidebar_text: '#9a3412',
    sidebar_border: '#fdba74'
  },
  'midnight-ocean': {
    background_color: '#0f172a',
    text_color: '#e0f2fe',
    input_background: '#1e293b',
    input_text: '#e0f2fe',
    input_border: '#0ea5e9',
    button_background: '#0284c7',
    button_text: '#ffffff',
    button_border: '#0369a1',
    prompt_border: '#0ea5e9',
    upload_background: '#1e293b',
    upload_text: '#e0f2fe',
    upload_border: '#0ea5e9',
    sidebar_text: '#7dd3fc',
    sidebar_border: '#0ea5e9'
  },
  'sage-garden': {
    background_color: '#f0fdf4',
    text_color: '#064e3b',
    input_background: '#dcfce7',
    input_text: '#064e3b',
    input_border: '#86efac',
    button_background: '#22c55e',
    button_text: '#ffffff',
    button_border: '#16a34a',
    prompt_border: '#86efac',
    upload_background: '#dcfce7',
    upload_text: '#064e3b',
    upload_border: '#86efac',
    sidebar_text: '#15803d',
    sidebar_border: '#86efac'
  }
}; 