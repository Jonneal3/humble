export interface GeneratedImage {
  image: string | null;
  provider: string;
  model?: string;
  prompt?: string;
  metadata?: Record<string, any>;
} 