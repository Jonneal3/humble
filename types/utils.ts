import { Database } from "./supabase";

// Use existing tables from the actual schema
export type aiModelRow = Database["public"]["Tables"]["ai_models"]["Row"];
export type imageRow = Database["public"]["Tables"]["images"]["Row"];
export type instanceRow = Database["public"]["Tables"]["instances"]["Row"];
export type billingRow = Database["public"]["Tables"]["billing"]["Row"];

// For backward compatibility, create a structure similar to what components expect
export type modelRowWithSamples = aiModelRow & {
  samples: imageRow[]; // Use images as samples since that's what we have
};

// Remove deprecated table references
// export type modelRow = Database["public"]["Tables"]["models"]["Row"];
// export type sampleRow = Database["public"]["Tables"]["samples"]["Row"];
// export type creditsRow = Database["public"]["Tables"]["credits"]["Row"];
