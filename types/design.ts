// Streamlined Design Types - Minimal and Essential Only
export type LayoutMode = "left-right" | "right-left" | "prompt-top" | "prompt-bottom";
export type BorderStyle = "solid" | "dashed" | "dotted" | "none";
export type ShadowStyle = "none" | "subtle" | "medium" | "large" | "glow";
export type TextAlign = "left" | "center" | "right";

// Core Design Interface - Much Simpler and Focused
export interface DesignSettings {
  // ===========================================
  // OVERALL STYLE SETTINGS
  // ===========================================
  background_color?: string;
  background_opacity?: number; // 0-1 for background transparency
  background_gradient?: string;
  background_image?: string;
  container_padding?: number; // Legacy: applies to all sides when individual padding not specified
  container_padding_top?: number; // Individual padding controls
  container_padding_right?: number;
  container_padding_bottom?: number;
  container_padding_left?: number;
  border_radius?: number;
  shadow_style?: ShadowStyle;
  sidebar_background_color?: string; // Background color for the designer sidebar
  
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
  title_font_family?: string;
  title_font_size?: number;
  cta_text?: string;
  cta_enabled?: boolean;
  cta_font_family?: string;
  cta_font_size?: number;
  cta_color?: string;
  
  // ===========================================
  // LAYOUT CONFIGURATION
  // ===========================================
  layout_mode?: LayoutMode;
  prompt_section_width?: number; // Percentage for left-right layout
  prompt_section_height?: number; // Percentage for top-bottom layout
  
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
  uploader_primary_text?: string; // Main upload text (e.g., "Add reference images to guide the AI generation")
  uploader_secondary_text?: string; // Secondary text (e.g., "Drag & drop or click to upload")
  
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
  gallery_font_family?: string;
  gallery_font_size?: number;
  
  // Gallery Overlay Settings
  overlay_enabled?: boolean;
  overlay_download_enabled?: boolean;
  overlay_reference_enabled?: boolean;
  overlay_background_color?: string;
  overlay_icon_color?: string;
  overlay_font_family?: string;
  overlay_font_size?: number;
  
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
  background_opacity: 1,
  background_gradient: "",
  background_image: "",
  container_padding: 24,
  container_padding_top: 24,
  container_padding_right: 24,
  container_padding_bottom: 24,
  container_padding_left: 24,
  border_radius: 12,
  shadow_style: "medium",
  sidebar_background_color: "#ffffff", // Default sidebar background
  
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
  title_font_family: "Inter",
  title_font_size: 20,
  cta_text: "Get started by uploading a reference image or entering a prompt",
  cta_enabled: false,
  cta_font_family: "Inter",
  cta_font_size: 16,
  cta_color: "#374151",
  
  // Layout
  layout_mode: "prompt-top",
  prompt_section_width: 40,
  prompt_section_height: 30,
  
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
  uploader_primary_text: "Add reference images to guide the AI generation",
  uploader_secondary_text: "Drag & drop or click to upload",
  
  // Prompt Section
  prompt_background_color: "transparent",
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
  gallery_font_family: "Inter",
  gallery_font_size: 14,
  
  // Gallery Overlay
  overlay_enabled: true,
  overlay_download_enabled: true,
  overlay_reference_enabled: true,
  overlay_background_color: "rgba(0, 0, 0, 0.5)",
  overlay_icon_color: "#ffffff",
  overlay_font_family: "Inter",
  overlay_font_size: 14,
  
  // Responsive
  mobile_layout_mode: "prompt-top",
  mobile_gallery_columns: 1,
  mobile_font_scale: 0.9,
};

// Theme Presets - Comprehensive Design Themes
export interface DesignTheme {
  name: string;
  description?: string;
  
  // ===========================================
  // OVERALL STYLE SETTINGS
  // ===========================================
  background_color?: string;
  background_opacity?: number; // 0-1 for background transparency
  background_gradient?: string;
  background_image?: string;
  container_padding?: number; // Legacy: applies to all sides when individual padding not specified
  container_padding_top?: number; // Individual padding controls
  container_padding_right?: number;
  container_padding_bottom?: number;
  container_padding_left?: number;
  border_radius?: number;
  shadow_style?: ShadowStyle;
  sidebar_background_color?: string; // Background color for the designer sidebar
  
  // ===========================================
  // HEADER SECTION
  // ===========================================
  header_enabled?: boolean;
  header_alignment?: TextAlign;
  
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
  title_font_family?: string;
  title_font_size?: number;
  cta_text?: string;
  cta_enabled?: boolean;
  cta_font_family?: string;
  cta_font_size?: number;
  cta_color?: string;
  
  // ===========================================
  // LAYOUT CONFIGURATION
  // ===========================================
  layout_mode?: LayoutMode;
  prompt_section_width?: number;
  prompt_section_height?: number;
  
  // ===========================================
  // IFRAME SETTINGS
  // ===========================================
  iframe_width?: string;
  iframe_height?: string;
  iframe_border?: boolean;
  iframe_border_width?: number;
  iframe_border_color?: string;
  iframe_border_radius?: number;
  iframe_shadow?: ShadowStyle;
  iframe_loading?: "lazy" | "eager";
  iframe_sandbox?: string;
  iframe_referrerpolicy?: string;
  iframe_allowtransparency?: boolean;
  iframe_scrolling?: "auto" | "yes" | "no";
  
  // ===========================================
  // IMAGE UPLOADER SECTION
  // ===========================================
  uploader_enabled?: boolean;
  uploader_max_images?: number;
  uploader_background_color?: string;
  uploader_border_style?: BorderStyle;
  uploader_border_color?: string;
  uploader_border_width?: number;
  uploader_border_radius?: number;
  uploader_text_color?: string;
  uploader_font_family?: string;
  uploader_font_size?: number;
  uploader_icon_style?: string;
  uploader_primary_text?: string;
  uploader_secondary_text?: string;
  
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
  gallery_font_family?: string;
  gallery_font_size?: number;
  
  // Gallery Overlay Settings
  overlay_enabled?: boolean;
  overlay_download_enabled?: boolean;
  overlay_reference_enabled?: boolean;
  overlay_background_color?: string;
  overlay_icon_color?: string;
  overlay_font_family?: string;
  overlay_font_size?: number;
  
  // ===========================================
  // RESPONSIVE SETTINGS
  // ===========================================
  mobile_layout_mode?: LayoutMode;
  mobile_gallery_columns?: number;
  mobile_font_scale?: number;

  // Legacy/Compatibility - keeping accent_color for easy theming
  accent_color?: string;
}

// Helper function to get complete theme with defaults
export const getCompleteTheme = (theme: DesignTheme): DesignSettings => ({
  // ===========================================
  // OVERALL STYLE SETTINGS
  // ===========================================
  background_color: theme.background_color ?? "#ffffff",
  background_opacity: theme.background_opacity ?? 1,
  background_gradient: theme.background_gradient ?? "",
  background_image: theme.background_image ?? "",
  container_padding: theme.container_padding ?? 24,
  container_padding_top: theme.container_padding_top ?? 24,
  container_padding_right: theme.container_padding_right ?? 24,
  container_padding_bottom: theme.container_padding_bottom ?? 24,
  container_padding_left: theme.container_padding_left ?? 24,
  border_radius: theme.border_radius ?? 12,
  shadow_style: theme.shadow_style ?? "medium",
  
  // ===========================================
  // HEADER SECTION
  // ===========================================
  header_enabled: theme.header_enabled ?? true,
  header_alignment: theme.header_alignment ?? "center",
  
  // Logo Settings
  logo_enabled: theme.logo_enabled ?? false,
  logo_url: theme.logo_url ?? "",
  logo_height: theme.logo_height ?? 48,
  logo_border_width: theme.logo_border_width ?? 0,
  logo_border_color: theme.logo_border_color ?? "#e5e7eb",
  logo_border_radius: theme.logo_border_radius ?? 4,
  
  // Brand Name Settings
  brand_name: theme.brand_name ?? "AI Studio",
  brand_name_enabled: theme.brand_name_enabled ?? true,
  brand_name_color: theme.brand_name_color ?? "#1f2937",
  brand_name_font_family: theme.brand_name_font_family ?? "Inter",
  brand_name_font_size: theme.brand_name_font_size ?? 28,
  
  // ===========================================
  // TITLE/CTA SECTION
  // ===========================================
  title_enabled: theme.title_enabled ?? false,
  title_text: theme.title_text ?? "Create Amazing AI Images",
  title_color: theme.title_color ?? "#374151",
  title_font_family: theme.title_font_family ?? "Inter",
  title_font_size: theme.title_font_size ?? 20,
  cta_text: theme.cta_text ?? "Get started by uploading a reference image or entering a prompt",
  cta_enabled: theme.cta_enabled ?? false,
  cta_font_family: theme.cta_font_family ?? "Inter",
  cta_font_size: theme.cta_font_size ?? 16,
  cta_color: theme.cta_color ?? "#374151",
  
  // ===========================================
  // LAYOUT CONFIGURATION
  // ===========================================
  layout_mode: theme.layout_mode ?? "prompt-top",
  prompt_section_width: theme.prompt_section_width ?? 40,
  prompt_section_height: theme.prompt_section_height ?? 30,
  
  // ===========================================
  // IFRAME SETTINGS
  // ===========================================
  iframe_width: theme.iframe_width ?? "100%",
  iframe_height: theme.iframe_height ?? "600px",
  iframe_border: theme.iframe_border ?? true,
  iframe_border_width: theme.iframe_border_width ?? 1,
  iframe_border_color: theme.iframe_border_color ?? "#e5e7eb",
  iframe_border_radius: theme.iframe_border_radius ?? 12,
  iframe_shadow: theme.iframe_shadow ?? "medium",
  iframe_loading: theme.iframe_loading ?? "lazy",
  iframe_sandbox: theme.iframe_sandbox ?? "allow-scripts allow-same-origin allow-forms",
  iframe_referrerpolicy: theme.iframe_referrerpolicy ?? "no-referrer-when-downgrade",
  iframe_allowtransparency: theme.iframe_allowtransparency ?? true,
  iframe_scrolling: theme.iframe_scrolling ?? "auto",
  
  // ===========================================
  // IMAGE UPLOADER SECTION
  // ===========================================
  uploader_enabled: theme.uploader_enabled ?? true,
  uploader_max_images: theme.uploader_max_images ?? 3,
  uploader_background_color: theme.uploader_background_color ?? "#f8fafc",
  uploader_border_style: theme.uploader_border_style ?? "dashed",
  uploader_border_color: theme.uploader_border_color ?? "#cbd5e1",
  uploader_border_width: theme.uploader_border_width ?? 2,
  uploader_border_radius: theme.uploader_border_radius ?? 12,
  uploader_text_color: theme.uploader_text_color ?? "#64748b",
  uploader_font_family: theme.uploader_font_family ?? "Inter",
  uploader_font_size: theme.uploader_font_size ?? 14,
  uploader_icon_style: theme.uploader_icon_style ?? "folder",
  uploader_primary_text: theme.uploader_primary_text ?? "Add reference images to guide the AI generation",
  uploader_secondary_text: theme.uploader_secondary_text ?? "Drag & drop or click to upload",
  
  // ===========================================
  // PROMPT SECTION
  // ===========================================
  prompt_background_color: theme.prompt_background_color ?? "transparent",
  prompt_border_style: theme.prompt_border_style ?? "solid",
  prompt_border_color: theme.prompt_border_color ?? "#e5e7eb",
  prompt_border_width: theme.prompt_border_width ?? 1,
  prompt_border_radius: theme.prompt_border_radius ?? 12,
  prompt_text_color: theme.prompt_text_color ?? "#374151",
  prompt_font_family: theme.prompt_font_family ?? "Inter",
  prompt_font_size: theme.prompt_font_size ?? 16,
  prompt_placeholder_color: theme.prompt_placeholder_color ?? "#9ca3af",
  
  // Suggestion Buttons
  suggestions_enabled: theme.suggestions_enabled ?? true,
  suggestions_count: theme.suggestions_count ?? 3,
  suggestion_background_color: theme.suggestion_background_color ?? "#ffffff",
  suggestion_text_color: theme.suggestion_text_color ?? "#374151",
  suggestion_border_style: theme.suggestion_border_style ?? "solid",
  suggestion_border_color: theme.suggestion_border_color ?? "#e5e7eb",
  suggestion_border_width: theme.suggestion_border_width ?? 1,
  suggestion_border_radius: theme.suggestion_border_radius ?? 8,
  suggestion_font_family: theme.suggestion_font_family ?? "Inter",
  suggestion_font_size: theme.suggestion_font_size ?? 12,
  suggestion_shadow_style: theme.suggestion_shadow_style ?? "subtle",
  suggestion_arrow_icon: theme.suggestion_arrow_icon ?? true,
  
  // ===========================================
  // IMAGE GALLERY SECTION
  // ===========================================
  gallery_background_color: theme.gallery_background_color ?? "transparent",
  gallery_border_style: theme.gallery_border_style ?? "solid",
  gallery_border_color: theme.gallery_border_color ?? "#e5e7eb",
  gallery_border_width: theme.gallery_border_width ?? 0,
  gallery_border_radius: theme.gallery_border_radius ?? 12,
  gallery_image_border_radius: theme.gallery_image_border_radius ?? 8,
  gallery_border_enabled: theme.gallery_border_enabled ?? false,
  gallery_spacing: theme.gallery_spacing ?? 16,
  gallery_columns: theme.gallery_columns ?? 2,
  gallery_max_images: theme.gallery_max_images ?? 4,
  gallery_shadow_style: theme.gallery_shadow_style ?? "medium",
  gallery_font_family: theme.gallery_font_family ?? "Inter",
  gallery_font_size: theme.gallery_font_size ?? 14,
  
  // Gallery Overlay Settings
  overlay_enabled: theme.overlay_enabled ?? true,
  overlay_download_enabled: theme.overlay_download_enabled ?? true,
  overlay_reference_enabled: theme.overlay_reference_enabled ?? true,
  overlay_background_color: theme.overlay_background_color ?? "rgba(0, 0, 0, 0.5)",
  overlay_icon_color: theme.overlay_icon_color ?? "#ffffff",
  overlay_font_family: theme.overlay_font_family ?? "Inter",
  overlay_font_size: theme.overlay_font_size ?? 14,
  
  // ===========================================
  // RESPONSIVE SETTINGS
  // ===========================================
  mobile_layout_mode: theme.mobile_layout_mode ?? "prompt-top",
  mobile_gallery_columns: theme.mobile_gallery_columns ?? 1,
  mobile_font_scale: theme.mobile_font_scale ?? 0.9,
});

export const designThemes: DesignTheme[] = [
  // Light Themes
  {
    name: "Modern Light",
    description: "Cool blue-gray minimal",
    
    // Overall styling - cooler blue-gray theme
    background_color: "#f8fafc",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 12,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#0f172a",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling - blue-gray tones
    prompt_background_color: "#f1f5f9",
    prompt_text_color: "#1e293b",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 12,
    prompt_border_color: "#cbd5e1",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#64748b",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#334155", 
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 8,
    suggestion_border_color: "#e2e8f0",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling - blue-gray theme
    uploader_enabled: true,
    uploader_background_color: "#f1f5f9",
    uploader_border_color: "#94a3b8",
    uploader_text_color: "#475569",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 12,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 12,
    gallery_image_border_radius: 8,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#e2e8f0",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#3b82f6"
  },
  {
    name: "Soft Pearl",
    description: "Warm beige elegance",
    
    // Overall styling - Warm beige/cream theme
    background_color: "#fefcf8",
    container_padding: 32,
    container_padding_top: 32,
    container_padding_right: 32,
    container_padding_bottom: 32,
    container_padding_left: 32,
    border_radius: 16,
    shadow_style: "subtle",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#292524",
    brand_name_font_family: "Inter",
    brand_name_font_size: 32,
    
    // Prompt styling
    prompt_background_color: "#faf7f0",
    prompt_text_color: "#44403c",
    prompt_font_family: "Inter",
    prompt_font_size: 17,
    prompt_border_radius: 16,
    prompt_border_color: "#e7e5e4",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#78716c",
    
    // Suggestions styling
    suggestion_background_color: "#fffef7",
    suggestion_text_color: "#57534e",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 12,
    suggestion_border_color: "#e7e5e4",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#f5f1e8",
    uploader_border_color: "#d6cc9a",
    uploader_text_color: "#78716c",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 16,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 20,
    gallery_border_radius: 12,
    gallery_image_border_radius: 12,
    gallery_shadow_style: "subtle",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#e7e5e4",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#d97706"
  },
  {
    name: "Arctic White",
    description: "Pure white with ice blue",
    
    // Overall styling - Pure white with cool ice blue accents
    background_color: "#ffffff",
    container_padding: 20,
    container_padding_top: 20,
    container_padding_right: 20,
    container_padding_bottom: 20,
    container_padding_left: 20,
    border_radius: 8,
    shadow_style: "large",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#1a202c",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#fefeff",
    prompt_text_color: "#1a202c",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 8,
    prompt_border_color: "#cbd5e1",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#a0aec0",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#2d3748",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 6,
    suggestion_border_color: "#e2e8f0",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#fafbfc",
    uploader_border_color: "#0ea5e9",
    uploader_text_color: "#2d3748",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 8,
    uploader_border_width: 2,
    uploader_border_style: "solid",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 12,
    gallery_border_radius: 12,
    gallery_image_border_radius: 6,
    gallery_shadow_style: "large",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: true,
    gallery_border_color: "#e2e8f0",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(59, 130, 246, 0.8)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#0ea5e9"
  },
  {
    name: "Cream Dream",
    description: "Warm cream tones",
    
    // Overall styling
    background_color: "#fefcf3",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 14,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#3c2414",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#f9f6ed",
    prompt_text_color: "#654321",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 14,
    prompt_border_color: "#e6ddd4",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#8b7355",
    
    // Suggestions styling
    suggestion_background_color: "#faf8f1",
    suggestion_text_color: "#654321",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#e6ddd4",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#f5f1e8",
    uploader_border_color: "#e6ddd4",
    uploader_text_color: "#8b7355",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 14,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 18,
    gallery_border_radius: 12,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#e6ddd4",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#d97706"
  },

  // Dark Themes
  {
    name: "Midnight",
    description: "Deep dark elegance",
    
    // Overall styling
    background_color: "#0f0f0f",
    container_padding: 28,
    container_padding_top: 28,
    container_padding_right: 28,
    container_padding_bottom: 28,
    container_padding_left: 28,
    border_radius: 16,
    shadow_style: "glow",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#ffffff",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#1a1a1a",
    prompt_text_color: "#e5e5e5",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 16,
    prompt_border_color: "#404040",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#a3a3a3",
    
    // Suggestions styling
    suggestion_background_color: "#262626",
    suggestion_text_color: "#e5e5e5",
    suggestion_font_family: "Inter", 
    suggestion_font_size: 12,
    suggestion_border_radius: 12,
    suggestion_border_color: "#404040",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "glow",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#171717",
    uploader_border_color: "#404040",
    uploader_text_color: "#a3a3a3",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 16,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "#111111",
    gallery_spacing: 20,
    gallery_border_radius: 16,
    gallery_image_border_radius: 12,
    gallery_shadow_style: "glow",
    gallery_border_color: "#404040",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(59, 130, 246, 0.8)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#3b82f6"
  },
  {
    name: "Dark Professional",
    description: "Professional dark mode",
    
    // Overall styling
    background_color: "#1e1e1e",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 10,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#ffffff",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#2d2d2d",
    prompt_text_color: "#ffffff",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 10,
    prompt_border_color: "#525252",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#a3a3a3",
    
    // Suggestions styling
    suggestion_background_color: "#3c3c3c",
    suggestion_text_color: "#ffffff",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 8,
    suggestion_border_color: "#525252",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#252525",
    uploader_border_color: "#525252",
    uploader_text_color: "#d4d4d8",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 10,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 10,
    gallery_image_border_radius: 8,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#525252",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.7)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#6366f1"
  },
  {
    name: "Carbon Black",
    description: "Sleek carbon fiber",
    
    // Overall styling
    background_color: "#111111",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 8,
    shadow_style: "glow",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#fafafa",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#1f1f1f",
    prompt_text_color: "#d4d4d8",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 8,
    prompt_border_color: "#3f3f46",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#a1a1aa",
    
    // Suggestions styling
    suggestion_background_color: "#27272a",
    suggestion_text_color: "#d4d4d8",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 6,
    suggestion_border_color: "#3f3f46",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "glow",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#18181b",
    uploader_border_color: "#3f3f46",
    uploader_text_color: "#a1a1aa",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 8,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 14,
    gallery_border_radius: 8,
    gallery_image_border_radius: 6,
    gallery_shadow_style: "glow",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#3f3f46",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.8)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#a855f7"
  },
  {
    name: "Space Gray",
    description: "Modern space theme",
    
    // Overall styling
    background_color: "#18181b",
    container_padding: 28,
    container_padding_top: 28,
    container_padding_right: 28,
    container_padding_bottom: 28,
    container_padding_left: 28,
    border_radius: 12,
    shadow_style: "large",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#f4f4f5",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#27272a",
    prompt_text_color: "#e4e4e7",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 12,
    prompt_border_color: "#52525b",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#a1a1aa",
    
    // Suggestions styling
    suggestion_background_color: "#3f3f46",
    suggestion_text_color: "#e4e4e7",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#52525b",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "large",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#1f1f23",
    uploader_border_color: "#52525b",
    uploader_text_color: "#a1a1aa",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 12,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 18,
    gallery_border_radius: 12,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "large",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#52525b",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.7)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#06b6d4"
  },

  // Blue Themes
  {
    name: "Ocean Breeze",
    description: "Calming ocean blues",
    
    // Overall styling
    background_color: "#f0f9ff",
    container_padding: 32,
    container_padding_top: 32,
    container_padding_right: 32,
    container_padding_bottom: 32,
    container_padding_left: 32,
    border_radius: 20,
    shadow_style: "large",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#0c4a6e",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#e0f2fe",
    prompt_text_color: "#075985",
    prompt_font_family: "Inter",
    prompt_font_size: 17,
    prompt_border_radius: 20,
    prompt_border_color: "#7dd3fc",
    prompt_border_width: 2,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#0369a1",
    
    // Suggestions styling
    suggestion_background_color: "#f0f9ff",
    suggestion_text_color: "#075985",
    suggestion_font_family: "Inter",
    suggestion_font_size: 13,
    suggestion_border_radius: 16,
    suggestion_border_color: "#7dd3fc",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#e0f2fe",
    uploader_border_color: "#7dd3fc",
    uploader_text_color: "#0369a1",
    uploader_font_family: "Inter",
    uploader_font_size: 15,
    uploader_border_radius: 20,
    uploader_border_width: 3,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "#f0f9ff",
    gallery_spacing: 24,
    gallery_border_radius: 20,
    gallery_image_border_radius: 16,
    gallery_shadow_style: "large",
    gallery_border_color: "#7dd3fc",
    gallery_font_family: "Inter",
    gallery_font_size: 15,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(14, 165, 233, 0.9)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 15,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#0ea5e9"
  },
  {
    name: "Sky Blue",
    description: "Fresh sky colors",
    
    // Overall styling
    background_color: "#f0f8ff",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 14,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#1e3a8a",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#dbeafe",
    prompt_text_color: "#1e40af",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 14,
    prompt_border_color: "#93c5fd",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#3730a3",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#1e40af",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#93c5fd",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#dbeafe",
    uploader_border_color: "#93c5fd",
    uploader_text_color: "#1d4ed8",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 14,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 14,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#93c5fd",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#3b82f6"
  },
  {
    name: "Deep Navy",
    description: "Professional navy",
    
    // Overall styling
    background_color: "#1e293b",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 10,
    shadow_style: "large",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#f1f5f9",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#334155",
    prompt_text_color: "#e2e8f0",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 10,
    prompt_border_color: "#64748b",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#cbd5e1",
    
    // Suggestions styling
    suggestion_background_color: "#475569",
    suggestion_text_color: "#e2e8f0",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 8,
    suggestion_border_color: "#64748b",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "large",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#2d3c52",
    uploader_border_color: "#64748b",
    uploader_text_color: "#cbd5e1",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 10,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 18,
    gallery_border_radius: 10,
    gallery_image_border_radius: 8,
    gallery_shadow_style: "large",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#64748b",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.7)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#38bdf8"
  },

  // Green Themes
  {
    name: "Forest Fresh",
    description: "Natural forest greens",
    
    // Overall styling
    background_color: "#f0fdf4",
    container_padding: 26,
    container_padding_top: 26,
    container_padding_right: 26,
    container_padding_bottom: 26,
    container_padding_left: 26,
    border_radius: 12,
    shadow_style: "subtle",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#022c22",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#dcfce7",
    prompt_text_color: "#064e3b",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 12,
    prompt_border_color: "#86efac",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#047857",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#064e3b",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#86efac",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#dcfce7",
    uploader_border_color: "#86efac",
    uploader_text_color: "#047857",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 12,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 18,
    gallery_border_radius: 12,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "subtle",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#86efac",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#22c55e"
  },
  {
    name: "Mint Cool",
    description: "Cool mint vibes",
    
    // Overall styling
    background_color: "#f0fdfa",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 16,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#134e4a",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#ccfbf1",
    prompt_text_color: "#0f766e",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 16,
    prompt_border_color: "#5eead4",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#0d9488",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#0f766e",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 12,
    suggestion_border_color: "#5eead4",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#ccfbf1",
    uploader_border_color: "#5eead4",
    uploader_text_color: "#0d9488",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 16,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 16,
    gallery_image_border_radius: 12,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#5eead4",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#14b8a6"
  },
  {
    name: "Sage Wisdom",
    description: "Sophisticated sage",
    
    // Overall styling
    background_color: "#f6f7f6",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 14,
    shadow_style: "subtle",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#1a2f1a",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#e8f2e8",
    prompt_text_color: "#2d4a2d",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 14,
    prompt_border_color: "#a7d3a7",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#4a6b4a",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#2d4a2d",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#a7d3a7",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#e8f2e8",
    uploader_border_color: "#a7d3a7",
    uploader_text_color: "#4a6b4a",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 14,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 14,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "subtle",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#a7d3a7",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#4ade80"
  },

  // Warm Themes
  {
    name: "Sunset Glow",
    description: "Warm sunset oranges",
    
    // Overall styling
    background_color: "#fff7ed",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 16,
    shadow_style: "glow",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#431407",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#ffedd5",
    prompt_text_color: "#7c2d12",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 16,
    prompt_border_color: "#fed7aa",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#9a3412",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#7c2d12",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 12,
    suggestion_border_color: "#fed7aa",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "glow",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#ffedd5",
    uploader_border_color: "#fed7aa",
    uploader_text_color: "#9a3412",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 16,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 20,
    gallery_border_radius: 16,
    gallery_image_border_radius: 12,
    gallery_shadow_style: "glow",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#fed7aa",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(249, 115, 22, 0.8)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#f97316"
  },
  {
    name: "Golden Hour",
    description: "Rich golden tones",
    
    // Overall styling
    background_color: "#fffbeb",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 12,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#451a03",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#fef3c7",
    prompt_text_color: "#92400e",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 12,
    prompt_border_color: "#fde68a",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#b45309",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#92400e",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#fde68a",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#fef3c7",
    uploader_border_color: "#fde68a",
    uploader_text_color: "#b45309",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 12,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 12,
    gallery_image_border_radius: 8,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#fde68a",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#f59e0b"
  },
  {
    name: "Coral Reef",
    description: "Vibrant coral accents",
    
    // Overall styling
    background_color: "#fff5f5",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 14,
    shadow_style: "subtle",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#742a2a",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#fed7d7",
    prompt_text_color: "#c53030",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 14,
    prompt_border_color: "#fc8181",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#e53e3e",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#c53030",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#fc8181",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#fed7d7",
    uploader_border_color: "#fc8181",
    uploader_text_color: "#e53e3e",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 14,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 14,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "subtle",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#fc8181",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#f56565"
  },

  // Purple & Pink Themes
  {
    name: "Purple Magic",
    description: "Mystical purple hues",
    
    // Overall styling
    background_color: "#faf5ff",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 16,
    shadow_style: "glow",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#4c1d95",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#f3e8ff",
    prompt_text_color: "#6b21a8",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 16,
    prompt_border_color: "#c084fc",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#7c3aed",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#6b21a8",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 12,
    suggestion_border_color: "#c084fc",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "glow",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#f3e8ff",
    uploader_border_color: "#c084fc",
    uploader_text_color: "#7c3aed",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 16,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 22,
    gallery_border_radius: 16,
    gallery_image_border_radius: 12,
    gallery_shadow_style: "glow",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#c084fc",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(168, 85, 247, 0.8)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#a855f7"
  },
  {
    name: "Rose Garden",
    description: "Elegant rose tones",
    
    // Overall styling
    background_color: "#fdf2f8",
    container_padding: 24,
    container_padding_top: 24,
    container_padding_right: 24,
    container_padding_bottom: 24,
    container_padding_left: 24,
    border_radius: 14,
    shadow_style: "medium",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#831843",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#fce7f3",
    prompt_text_color: "#be185d",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 14,
    prompt_border_color: "#f9a8d4",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#d946ef",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#be185d",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 10,
    suggestion_border_color: "#f9a8d4",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "medium",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#fce7f3",
    uploader_border_color: "#f9a8d4",
    uploader_text_color: "#d946ef",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 14,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 16,
    gallery_border_radius: 14,
    gallery_image_border_radius: 10,
    gallery_shadow_style: "medium",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#f9a8d4",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#ec4899"
  },
  {
    name: "Lavender Dreams",
    description: "Soft lavender beauty",
    
    // Overall styling
    background_color: "#faf5ff",
    container_padding: 30,
    container_padding_top: 30,
    container_padding_right: 30,
    container_padding_bottom: 30,
    container_padding_left: 30,
    border_radius: 18,
    shadow_style: "subtle",
    
    // Header
    header_enabled: true,
    header_alignment: "center",
    brand_name_color: "#5b21b6",
    brand_name_font_family: "Inter",
    brand_name_font_size: 28,
    
    // Prompt styling
    prompt_background_color: "#ede9fe",
    prompt_text_color: "#7c3aed",
    prompt_font_family: "Inter",
    prompt_font_size: 16,
    prompt_border_radius: 18,
    prompt_border_color: "#c4b5fd",
    prompt_border_width: 1,
    prompt_border_style: "solid",
    prompt_placeholder_color: "#8b5cf6",
    
    // Suggestions styling
    suggestion_background_color: "#ffffff",
    suggestion_text_color: "#7c3aed",
    suggestion_font_family: "Inter",
    suggestion_font_size: 12,
    suggestion_border_radius: 14,
    suggestion_border_color: "#c4b5fd",
    suggestion_border_width: 1,
    suggestion_border_style: "solid",
    suggestion_shadow_style: "subtle",
    suggestion_arrow_icon: true,
    
    // Uploader styling
    uploader_enabled: true,
    uploader_background_color: "#ede9fe",
    uploader_border_color: "#c4b5fd",
    uploader_text_color: "#8b5cf6",
    uploader_font_family: "Inter",
    uploader_font_size: 14,
    uploader_border_radius: 18,
    uploader_border_width: 2,
    uploader_border_style: "dashed",
    uploader_primary_text: "Add reference images to guide the AI generation",
    uploader_secondary_text: "Drag & drop or click to upload",
    
    // Gallery styling
    gallery_background_color: "transparent",
    gallery_spacing: 24,
    gallery_border_radius: 18,
    gallery_image_border_radius: 14,
    gallery_shadow_style: "subtle",
    gallery_font_family: "Inter",
    gallery_font_size: 14,
    gallery_columns: 2,
    gallery_border_enabled: false,
    gallery_border_color: "#c4b5fd",
    gallery_border_width: 1,
    gallery_border_style: "solid",
    
    // Overlay styling
    overlay_enabled: true,
    overlay_background_color: "rgba(0, 0, 0, 0.5)",
    overlay_icon_color: "#ffffff",
    overlay_font_family: "Inter",
    overlay_font_size: 14,
    overlay_download_enabled: true,
    overlay_reference_enabled: true,
    
    // Theme accent
    accent_color: "#8b5cf6"
  }
];

// Curated Google Fonts List - Diverse and Distinctive
export const fontOptions = [
  // Sans-Serif - Clean and Modern
  { value: "Inter", label: "Inter", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Roboto", label: "Roboto", category: "Sans-Serif", weight: "300,400,500,700" },
  { value: "Poppins", label: "Poppins", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Montserrat", label: "Montserrat", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Open Sans", label: "Open Sans", category: "Sans-Serif", weight: "300,400,600,700" },
  { value: "Lato", label: "Lato", category: "Sans-Serif", weight: "300,400,700" },
  { value: "Nunito", label: "Nunito", category: "Sans-Serif", weight: "300,400,600,700" },
  { value: "Work Sans", label: "Work Sans", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Source Sans Pro", label: "Source Sans Pro", category: "Sans-Serif", weight: "300,400,600,700" },
  { value: "Raleway", label: "Raleway", category: "Sans-Serif", weight: "300,400,500,600,700" },
  
  // Display & Decorative - Unique Character
  { value: "Playfair Display", label: "Playfair Display", category: "Serif", weight: "400,500,600,700" },
  { value: "Oswald", label: "Oswald", category: "Display", weight: "300,400,500,600,700" },
  { value: "Bebas Neue", label: "Bebas Neue", category: "Display", weight: "400" },
  { value: "Dancing Script", label: "Dancing Script", category: "Handwriting", weight: "400,500,600,700" },
  { value: "Pacifico", label: "Pacifico", category: "Handwriting", weight: "400" },
  { value: "Lobster", label: "Lobster", category: "Display", weight: "400" },
  { value: "Righteous", label: "Righteous", category: "Display", weight: "400" },
  { value: "Fredoka One", label: "Fredoka One", category: "Display", weight: "400" },
  { value: "Abril Fatface", label: "Abril Fatface", category: "Display", weight: "400" },
  { value: "Anton", label: "Anton", category: "Display", weight: "400" },
  
  // Serif - Classic and Elegant  
  { value: "Merriweather", label: "Merriweather", category: "Serif", weight: "300,400,700" },
  { value: "Lora", label: "Lora", category: "Serif", weight: "400,500,600,700" },
  { value: "Crimson Text", label: "Crimson Text", category: "Serif", weight: "400,600,700" },
  { value: "EB Garamond", label: "EB Garamond", category: "Serif", weight: "400,500,600,700" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "Serif", weight: "400,700" },
  { value: "Old Standard TT", label: "Old Standard TT", category: "Serif", weight: "400,700" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "Serif", weight: "300,400,500,600,700" },
  
  // Unique & Rounded
  { value: "Comfortaa", label: "Comfortaa", category: "Display", weight: "300,400,500,600,700" },
  { value: "Quicksand", label: "Quicksand", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Varela Round", label: "Varela Round", category: "Sans-Serif", weight: "400" },
  { value: "Rubik", label: "Rubik", category: "Sans-Serif", weight: "300,400,500,600,700" },
  
  // Monospace - Code Style
  { value: "JetBrains Mono", label: "JetBrains Mono", category: "Monospace", weight: "300,400,500,600,700" },
  { value: "Fira Code", label: "Fira Code", category: "Monospace", weight: "300,400,500,600,700" },
  { value: "Source Code Pro", label: "Source Code Pro", category: "Monospace", weight: "300,400,500,600,700" },
  { value: "Roboto Mono", label: "Roboto Mono", category: "Monospace", weight: "300,400,500,600,700" },
  
  // Creative & Artistic
  { value: "Satisfy", label: "Satisfy", category: "Handwriting", weight: "400" },
  { value: "Great Vibes", label: "Great Vibes", category: "Handwriting", weight: "400" },
  { value: "Amatic SC", label: "Amatic SC", category: "Handwriting", weight: "400,700" },
  { value: "Bangers", label: "Bangers", category: "Display", weight: "400" },
  { value: "Press Start 2P", label: "Press Start 2P", category: "Display", weight: "400" },
  
  // Modern Trending
  { value: "Space Grotesk", label: "Space Grotesk", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "DM Sans", label: "DM Sans", category: "Sans-Serif", weight: "400,500,700" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Outfit", label: "Outfit", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Manrope", label: "Manrope", category: "Sans-Serif", weight: "300,400,500,600,700" },
  { value: "Red Hat Display", label: "Red Hat Display", category: "Sans-Serif", weight: "300,400,500,600,700" },
];

// Helper function to load Google Font dynamically - Optimized for speed
export const loadGoogleFont = (fontFamily: string, weights: string = "300,400,500,600,700") => {
  // Skip system fonts
  if (fontFamily === 'inherit' || fontFamily === 'sans-serif' || fontFamily === 'serif') {
    return;
  }

  // Check if font is already loaded
  const fontId = `font-${fontFamily.replace(/\s+/g, '-')}`;
  if (document.getElementById(fontId)) return;

  // Create and append Google Fonts link with optimized loading
  const link = document.createElement('link');
  link.id = fontId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${weights}&display=swap`;
  link.rel = 'stylesheet';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Get fonts by category
export const getFontsByCategory = (category?: string) => {
  if (!category) return fontOptions;
  return fontOptions.filter(font => font.category === category);
};

// Get font categories
export const fontCategories = [
  { value: "all", label: "All Fonts" },
  { value: "Sans-Serif", label: "Sans-Serif" },
  { value: "Serif", label: "Serif" },
  { value: "Display", label: "Display" },
  { value: "Monospace", label: "Monospace" }
];

// Legacy compatibility - keeping minimal backwards compatibility
export type WidgetStyle = "modern" | "minimal" | "classic" | "bold" | "playful";
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
  },
  bold: {
    border_radius: 0,
    shadow_style: "large",
    container_padding: 24,
  },
  playful: {
    border_radius: 20,
    shadow_style: "medium",
    container_padding: 16,
  }
};

// Utility function to convert hex color + opacity to rgba
export const hexToRgba = (hex: string, opacity: number = 1): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-character hex codes
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Clamp opacity between 0 and 1
  opacity = Math.max(0, Math.min(1, opacity));
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Utility function to get background color with opacity
export const getBackgroundColor = (color?: string, opacity?: number): string => {
  if (!color) return 'transparent';
  if (opacity === undefined || opacity === 1) return color;
  if (color.startsWith('rgba') || color.startsWith('rgb')) return color;
  return hexToRgba(color, opacity);
};

// Utility function to get effective padding values
export const getEffectivePadding = (settings: DesignSettings) => {
  const fallback = settings.container_padding !== undefined ? settings.container_padding : 24;
  
  return {
    top: settings.container_padding_top !== undefined ? settings.container_padding_top : fallback,
    right: settings.container_padding_right !== undefined ? settings.container_padding_right : fallback,
    bottom: settings.container_padding_bottom !== undefined ? settings.container_padding_bottom : fallback,
    left: settings.container_padding_left !== undefined ? settings.container_padding_left : fallback,
  };
};

// Utility function to get CSS padding string
export const getPaddingCSS = (settings: DesignSettings): string => {
  const padding = getEffectivePadding(settings);
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}; 