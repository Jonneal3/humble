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
  gallery_spacing?: number;
  gallery_columns?: number;
  gallery_max_images?: number;
  gallery_shadow_style?: ShadowStyle;
  
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
  gallery_border_style: "none",
  gallery_border_color: "#e5e7eb",
  gallery_border_width: 0,
  gallery_border_radius: 12,
  gallery_spacing: 16,
  gallery_columns: 2,
  gallery_max_images: 4,
  gallery_shadow_style: "medium",
  
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

// Color Presets - Simplified
export interface ColorPreset {
  name: string;
  background_color: string;
  prompt_background_color: string;
  prompt_text_color: string;
  suggestion_background_color: string;
  brand_name_color: string;
  accent_color: string;
}

export const colorPresets: ColorPreset[] = [
  {
    name: "Modern Light",
    background_color: "#ffffff",
    prompt_background_color: "#f9fafb",
    prompt_text_color: "#374151",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#1f2937",
    accent_color: "#6366f1"
  },
  {
    name: "Dark Mode",
    background_color: "#1a1a1a",
    prompt_background_color: "#2d2d2d",
    prompt_text_color: "#ffffff",
    suggestion_background_color: "#2d2d2d",
    brand_name_color: "#ffffff",
    accent_color: "#3b82f6"
  },
  {
    name: "Ocean Blue",
    background_color: "#f0f9ff",
    prompt_background_color: "#e0f2fe",
    prompt_text_color: "#075985",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#075985",
    accent_color: "#0ea5e9"
  },
  {
    name: "Forest Green",
    background_color: "#f0fdf4",
    prompt_background_color: "#dcfce7",
    prompt_text_color: "#064e3b",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#064e3b",
    accent_color: "#22c55e"
  },
  {
    name: "Sunset Orange",
    background_color: "#fff7ed",
    prompt_background_color: "#ffedd5",
    prompt_text_color: "#7c2d12",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#7c2d12",
    accent_color: "#f97316"
  },
  {
    name: "Purple Magic",
    background_color: "#faf5ff",
    prompt_background_color: "#f3e8ff",
    prompt_text_color: "#6b21a8",
    suggestion_background_color: "#ffffff",
    brand_name_color: "#6b21a8",
    accent_color: "#a855f7"
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