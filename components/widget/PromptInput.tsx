"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  customStyles?: {
    container?: React.CSSProperties;
    input?: React.CSSProperties;
    button?: React.CSSProperties;
  };
}

export function PromptInput({
  onSubmit,
  isLoading = false,
  customStyles,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      style={customStyles?.container}
    >
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className={cn(
            "w-full min-h-[100px] p-3 rounded-lg resize-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/50"
          )}
          style={customStyles?.input}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={cn(
            "absolute bottom-3 right-3 p-2 rounded-lg",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:bg-primary/10 transition-colors"
          )}
          style={customStyles?.button}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
} 