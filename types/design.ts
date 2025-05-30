// Streamlined Design Types - Minimal and Essential Only
export type LayoutMode = "left-right" | "prompt-top" | "prompt-bottom";
export type BorderStyle = "solid" | "dashed" | "dotted" | "none";
export type ShadowStyle = "none" | "subtle" | "medium" | "large" | "glow";
export type TextAlign = "left" | "center" | "right";

// Core Design Interface - Much Simpler and Focused
export interface DesignSettings {
  // ===========================================
  // OVERALL STYLE SETTINGS
  // ===========================================
  background_color?: string;
  background_gradient?: string;
  background_image?: string;
  container_padding?: number;
  border_radius?: number;
  shadow_style?: ShadowStyle;
  
  // ===========================================
  // HEADER SECTION
  // ===========================================
  header_enabled?: boolean;
  header_alignment?: TextAlign; // left, center, right
  
  // Logo Settings
  logo_enabled?: boolean;
  logo_url?: string;
  logo_height?: number;
  logo_border_width?: number;
  logo_border_color?: string;
  logo_border_radius?: number;
  
  // Brand Name Settings
  brand_name?: string;
  brand_name_enabled?: boolean;
  brand_name_color?: string;
  brand_name_font_family?: string;
  brand_name_font_size?: number;
  
  // ===========================================
  // TITLE/CTA SECTION
  // ===========================================
  title_enabled?: boolean;
  title_text?: string;
  title_color?: string;
  title_font_size?: number;
  cta_text?: string;
  cta_enabled?: boolean;
  
  // ===========================================
  // LAYOUT CONFIGURATION
  // ===========================================
  layout_mode?: LayoutMode;
  prompt_section_width?: number; // Percentage for left-right layout
  
  // ===========================================
  // IFRAME SETTINGS (when layout_mode is 'iframe')
  // ===========================================
  iframe_width?: string; // e.g., "100%", "800px"
  iframe_height?: string; // e.g., "600px", "100vh"
  iframe_border?: boolean;
  iframe_border_width?: number;
  iframe_border_color?: string;
  iframe_border_radius?: number;
  iframe_shadow?: ShadowStyle;
  iframe_loading?: "lazy" | "eager";
  iframe_sandbox?: string; // e.g., "allow-scripts allow-same-origin allow-forms"
  iframe_referrerpolicy?: string;
  iframe_allowtransparency?: boolean;
  iframe_scrolling?: "auto" | "yes" | "no";
  
  // ===========================================
  // IMAGE UPLOADER SECTION
  // ===========================================
  uploader_enabled?: boolean;
  uploader_max_images?: number; // Maximum number of reference images (1-6)
  uploader_background_color?: string;
  uploader_border_style?: BorderStyle;
  uploader_border_color?: string;
  uploader_border_width?: number;
  uploader_border_radius?: number;
  uploader_text_color?: string;
  uploader_font_family?: string;
  uploader_font_size?: number;
  uploader_icon_style?: string; // For upload folder/icon design
  
  // ===========================================
  // PROMPT SECTION
  // ===========================================
  prompt_background_color?: string;
  prompt_border_style?: BorderStyle;
  prompt_border_color?: string;
  prompt_border_width?: number;
  prompt_border_radius?: number;
  prompt_text_color?: string;
  prompt_font_family?: string;
  prompt_font_size?: number;
  prompt_placeholder_color?: string;
  
  // Suggestion Buttons
  suggestions_enabled?: boolean;
  suggestions_count?: number;
  suggestion_background_color?: string;
  suggestion_text_color?: string;
  suggestion_border_style?: BorderStyle;
  suggestion_border_color?: string;
  suggestion_border_width?: number;
  suggestion_border_radius?: number;
  suggestion_font_family?: string;
  suggestion_font_size?: number;
  suggestion_shadow_style?: ShadowStyle;
  suggestion_arrow_icon?: boolean;
  
  // ===========================================
  // IMAGE GALLERY SECTION
  // ===========================================
  gallery_background_color?: string;
  gallery_border_style?: BorderStyle;
  gallery_border_color?: string;
  gallery_border_width?: number;
  gallery_border_radius?: number;
  gallery_image_border_radius?: number;
  gallery_border_enabled?: boolean;
  gallery_spacing?: number;
  gallery_columns?: number;
  gallery_max_images?: number;
  gallery_shadow_style?: ShadowStyle;
  gallery_scrolling_enabled?: boolean;
  
  // Gallery Overlay Settings
  overlay_enabled?: boolean;
  overlay_download_enabled?: boolean;
  overlay_reference_enabled?: boolean;
  overlay_background_color?: string;
  overlay_icon_color?: string;
  
  // ===========================================
  // RESPONSIVE SETTINGS
  // ===========================================
  mobile_layout_mode?: LayoutMode;
  mobile_gallery_columns?: number;
  mobile_font_scale?: number;
}

// Default settings - much cleaner
export const defaultDesignSettings: DesignSettings = {
  // Overall Style
  background_color: "#ffffff",
  background_gradient: "",
  background_image: "",
  container_padding: 24,
  border_radius: 12,
  shadow_style: "medium",
  
  // Header
  header_enabled: true,
  header_alignment: "center",
  logo_enabled: false,
  logo_url: "",
  logo_height: 48,
  logo_border_width: 0,
  logo_border_color: "#e5e7eb",
  logo_border_radius: 4,
  brand_name: "AI Studio",
  brand_name_enabled: true,
  brand_name_color: "#1f2937",
  brand_name_font_family: "Inter",
  brand_name_font_size: 28,
  
  // Title/CTA
  title_enabled: false,
  title_text: "Create Amazing AI Images",
  title_color: "#374151",
  title_font_size: 20,
  cta_text: "Get started by uploading a reference image or entering a prompt",
  cta_enabled: false,
  
  // Layout
  layout_mode: "prompt-top",
  prompt_section_width: 40,
  
  // Iframe Settings
  iframe_width: "100%",
  iframe_height: "600px",
  iframe_border: true,
  iframe_border_width: 1,
  iframe_border_color: "#e5e7eb",
  iframe_border_radius: 12,
  iframe_shadow: "medium",
  iframe_loading: "lazy",
  iframe_sandbox: "allow-scripts allow-same-origin allow-forms",
  iframe_referrerpolicy: "no-referrer-when-downgrade",
  iframe_allowtransparency: true,
  iframe_scrolling: "auto",
  
  // Image Uploader
  uploader_enabled: true,
  uploader_max_images: 3,
  uploader_background_color: "#f8fafc",
  uploader_border_style: "dashed",
  uploader_border_color: "#cbd5e1",
  uploader_border_width: 2,
  uploader_border_radius: 12,
  uploader_text_color: "#64748b",
  uploader_font_family: "Inter",
  uploader_font_size: 14,
  uploader_icon_style: "folder",
  
  // Prompt Section
  prompt_background_color: "#f9fafb",
  prompt_border_style: "solid",
  prompt_border_color: "#e5e7eb",
  prompt_border_width: 1,
  prompt_border_radius: 12,
  prompt_text_color: "#374151",
  prompt_font_family: "Inter",
  prompt_font_size: 16,
  prompt_placeholder_color: "#9ca3af",
  
  // Suggestion Buttons
  suggestions_enabled: true,
  suggestions_count: 3,
  suggestion_background_color: "#ffffff",
  suggestion_text_color: "#374151",
  suggestion_border_style: "solid",
  suggestion_border_color: "#e5e7eb",
  suggestion_border_width: 1,
  suggestion_border_radius: 8,
  suggestion_font_family: "Inter",
  suggestion_font_size: 12,
  suggestion_shadow_style: "subtle",
  suggestion_arrow_icon: true,
  
  // Image Gallery
  gallery_background_color: "transparent",
  gallery_border_style: "solid",
  gallery_border_color: "#e5e7eb",
  gallery_border_width: 0,
  gallery_border_radius: 12,
  gallery_image_border_radius: 8,
  gallery_border_enabled: false,
  gallery_spacing: 16,
  gallery_columns: 2,
  gallery_max_images: 4,
  gallery_shadow_style: "medium",
  gallery_scrolling_enabled: false,
  
  // Gallery Overlay
  overlay_enabled: true,
  overlay_download_enabled: true,
  overlay_reference_enabled: true,
  overlay_background_color: "rgba(0, 0, 0, 0.5)",
  overlay_icon_color: "#ffffff",
  
  // Responsive
  mobile_layout_mode: "prompt-top",
  mobile_gallery_columns: 1,
  mobile_font_scale: 0.9,
};

// Theme Presets - Comprehensive Design Themes
export interface DesignTheme {
  name: string;
  description?: string;
  
  // Core Colors (required)
  background_color: string;
  prompt_background_color: string;
  prompt_text_color: string;
  suggestion_background_color: string;
  brand_name_color: string;
  accent_color: string;
  
  // Overall Style (optional - will use defaults if not specified)
  border_radius?: number;
  shadow_style?: ShadowStyle;
  container_padding?: number;
  
  // Gallery Settings (optional)
  gallery_background_color?: string;
  gallery_border_radius?: number;
  gallery_image_border_radius?: number;
  gallery_shadow_style?: ShadowStyle;
  gallery_spacing?: number;
  gallery_border_enabled?: boolean;
  gallery_border_width?: number;
  gallery_border_color?: string;
  
  // Uploader Settings (optional)
  uploader_background_color?: string;
  uploader_border_radius?: number;
  uploader_border_color?: string;
  
  // Suggestion Settings (optional)
  suggestion_border_radius?: number;
  suggestion_shadow_style?: ShadowStyle;
  suggestion_border_color?: string;
  
  // Prompt Settings (optional)
  prompt_border_radius?: number;
  prompt_border_color?: string;
}

// Helper function to get complete theme with defaults
export const getCompleteTheme = (theme: DesignTheme) => ({
  ...theme,
  description: theme.description ?? "",
  border_radius: theme.border_radius ?? 12,
  shadow_style: theme.shadow_style ?? "medium",
  container_padding: theme.container_padding ?? 24,
  gallery_background_color: theme.gallery_background_color ?? "transparent",
  gallery_border_radius: theme.gallery_border_radius ?? 12,
  gallery_image_border_radius: theme.gallery_image_border_radius ?? 8,
  gallery_shadow_style: theme.gallery_shadow_style ?? "medium",
  gallery_spacing: theme.gallery_spacing ?? 16,
  gallery_border_enabled: theme.gallery_border_enabled ?? false,
  gallery_border_width: theme.gallery_border_width ?? 0,
  gallery_border_color: theme.gallery_border_color ?? "#e5e7eb",
  uploader_background_color: theme.uploader_background_color ?? "#f8fafc",
  uploader_border_radius: theme.uploader_border_radius ?? 12,
  uploader_border_color: theme.uploader_border_color ?? "#cbd5e1",
  suggestion_border_radius: theme.suggestion_border_radius ?? 8,
  suggestion_shadow_style: theme.suggestion_shadow_style ?? "subtle",
  suggestion_border_color: theme.suggestion_border_color ?? "#e5e7eb",
  prompt_border_radius: theme.prompt_border_radius ?? 12,
  prompt_border_color: theme.prompt_border_color ?? "#e5e7eb"
});

export const designThemes: DesignTheme[] = [
  // Light Themes
  {
    name: "Modern Light",
    description: "Clean and minimal",
    background_color: "#ffffff",
    prompt_background_color: "#f9fafb",
    prompt_text_color: "#374151",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#1f2937",
    accent_color: "#6366f1"
  },
  {
    name: "Soft Pearl",
    description: "Elegant warm whites",
    background_color: "#fefefe",
    prompt_background_color: "#f8f9fa",
    prompt_text_color: "#495057",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#212529",
    accent_color: "#868e96",
    
    // Custom styling for elegant look
    border_radius: 16,
    shadow_style: "subtle",
    container_padding: 32,
    gallery_spacing: 20,
    gallery_image_border_radius: 12
  },
  {
    name: "Arctic White",
    description: "Pure and crisp",
    background_color: "#ffffff",
    prompt_background_color: "#f8fafc",
    prompt_text_color: "#334155",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#0f172a",
    accent_color: "#0ea5e9",
    
    // Sharp, modern styling
    border_radius: 8,
    shadow_style: "large",
    container_padding: 20,
    gallery_spacing: 12,
    gallery_border_enabled: true,
    gallery_border_width: 1,
    gallery_border_color: "#e2e8f0"
  },
  {
    name: "Cream Dream",
    description: "Warm cream tones",
    background_color: "#fefcf3",
    prompt_background_color: "#f9f6ed",
    prompt_text_color: "#654321",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#3c2414",
    accent_color: "#d97706"
  },

  // Dark Themes
  {
    name: "Midnight",
    description: "Deep dark elegance",
    background_color: "#0f0f0f",
    prompt_background_color: "#1a1a1a",
    prompt_text_color: "#e5e5e5",
    suggestion_background_color: "#262626",
    brand_name_color: "#ffffff",
    accent_color: "#3b82f6"
  },
  {
    name: "Dark Professional",
    description: "Professional dark mode",
    background_color: "#1e1e1e",
    prompt_background_color: "#2d2d2d",
    prompt_text_color: "#ffffff",
    suggestion_background_color: "#3c3c3c",
    brand_name_color: "#ffffff",
    accent_color: "#6366f1"
  },
  {
    name: "Carbon Black",
    description: "Sleek carbon fiber",
    background_color: "#111111",
    prompt_background_color: "#1f1f1f",
    prompt_text_color: "#d4d4d8",
    suggestion_background_color: "#27272a",
    brand_name_color: "#fafafa",
    accent_color: "#a855f7"
  },
  {
    name: "Space Gray",
    description: "Modern space theme",
    background_color: "#18181b",
    prompt_background_color: "#27272a",
    prompt_text_color: "#e4e4e7",
    suggestion_background_color: "#3f3f46",
    brand_name_color: "#f4f4f5",
    accent_color: "#06b6d4"
  },

  // Blue Themes
  {
    name: "Ocean Breeze",
    description: "Calming ocean blues",
    background_color: "#f0f9ff",
    prompt_background_color: "#e0f2fe",
    prompt_text_color: "#075985",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#0c4a6e",
    accent_color: "#0ea5e9"
  },
  {
    name: "Sky Blue",
    description: "Fresh sky colors",
    background_color: "#f0f8ff",
    prompt_background_color: "#dbeafe",
    prompt_text_color: "#1e40af",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#1e3a8a",
    accent_color: "#3b82f6"
  },
  {
    name: "Deep Navy",
    description: "Professional navy",
    background_color: "#1e293b",
    prompt_background_color: "#334155",
    prompt_text_color: "#e2e8f0",
    suggestion_background_color: "#475569",
    brand_name_color: "#f1f5f9",
    accent_color: "#38bdf8"
  },

  // Green Themes
  {
    name: "Forest Fresh",
    description: "Natural forest greens",
    background_color: "#f0fdf4",
    prompt_background_color: "#dcfce7",
    prompt_text_color: "#064e3b",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#022c22",
    accent_color: "#22c55e"
  },
  {
    name: "Mint Cool",
    description: "Cool mint vibes",
    background_color: "#f0fdfa",
    prompt_background_color: "#ccfbf1",
    prompt_text_color: "#0f766e",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#134e4a",
    accent_color: "#14b8a6"
  },
  {
    name: "Sage Wisdom",
    description: "Sophisticated sage",
    background_color: "#f6f7f6",
    prompt_background_color: "#e8f2e8",
    prompt_text_color: "#2d4a2d",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#1a2f1a",
    accent_color: "#4ade80"
  },

  // Warm Themes
  {
    name: "Sunset Glow",
    description: "Warm sunset oranges",
    background_color: "#fff7ed",
    prompt_background_color: "#ffedd5",
    prompt_text_color: "#7c2d12",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#431407",
    accent_color: "#f97316"
  },
  {
    name: "Golden Hour",
    description: "Rich golden tones",
    background_color: "#fffbeb",
    prompt_background_color: "#fef3c7",
    prompt_text_color: "#92400e",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#451a03",
    accent_color: "#f59e0b"
  },
  {
    name: "Coral Reef",
    description: "Vibrant coral accents",
    background_color: "#fff5f5",
    prompt_background_color: "#fed7d7",
    prompt_text_color: "#c53030",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#742a2a",
    accent_color: "#f56565"
  },

  // Purple & Pink Themes
  {
    name: "Purple Magic",
    description: "Mystical purple hues",
    background_color: "#faf5ff",
    prompt_background_color: "#f3e8ff",
    prompt_text_color: "#6b21a8",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#4c1d95",
    accent_color: "#a855f7"
  },
  {
    name: "Rose Garden",
    description: "Elegant rose tones",
    background_color: "#fdf2f8",
    prompt_background_color: "#fce7f3",
    prompt_text_color: "#be185d",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#831843",
    accent_color: "#ec4899"
  },
  {
    name: "Lavender Dreams",
    description: "Soft lavender beauty",
    background_color: "#faf5ff",
    prompt_background_color: "#ede9fe",
    prompt_text_color: "#7c3aed",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#5b21b6",
    accent_color: "#8b5cf6"
  }
];

// Font options
export const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
];

// Legacy compatibility - keeping minimal backwards compatibility
export type WidgetStyle = "modern" | "minimal" | "classic";
export const stylePresets: Record<WidgetStyle, Partial<DesignSettings>> = {
  modern: {
    border_radius: 12,
    shadow_style: "medium",
    container_padding: 24,
  },
  minimal: {
    border_radius: 8,
    shadow_style: "subtle",
    container_padding: 16,
  },
  classic: {
    border_radius: 0,
    shadow_style: "none",
    container_padding: 20,
  }
}; 