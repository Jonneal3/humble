"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Suggestion } from "@/lib/suggestions";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, RefreshCw, Spinner, ArrowUp } from "lucide-react";
import { Icons } from "@/components/icons";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  suggestions: Suggestion[];
  customStyles?: {
    container?: React.CSSProperties;
    input?: React.CSSProperties;
    button?: React.CSSProperties;
    suggestionButton?: React.CSSProperties;
    submitButton?: React.CSSProperties;
    border?: React.CSSProperties;
    brand?: React.CSSProperties;
  };
}

export function PromptInput({
  onSubmit,
  isLoading,
  suggestions,
  customStyles,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
      setSelectedSuggestion(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setPrompt(suggestion.prompt);
  };

  return (
    <div className="w-full mb-6" style={customStyles?.container}>
      <div className="rounded-xl p-4" style={customStyles?.input}>
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create..."
          className="text-base border-none p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-50"
          style={{
            ...customStyles?.input,
            border: 'none',
            outline: 'none',
            color: customStyles?.input?.color || 'inherit',
          }}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="flex items-center justify-center p-2 rounded-lg text-sm hover:opacity-70 group transition-all duration-200"
            style={{
              ...customStyles?.button,
              border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                Generate
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setPrompt("");
              setSelectedSuggestion(null);
            }}
            className="h-8 w-8 rounded-full flex items-center justify-center disabled:opacity-50 transition-all duration-200 hover:scale-105"
            style={customStyles?.submitButton}
          >
            <RefreshCw className="w-4 h-4 group-hover:opacity-70" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "flex items-center justify-between px-2.5 rounded-lg py-1.5 text-sm hover:opacity-70 group transition-all duration-200",
                index > 2 ? "hidden md:flex" : index > 1 ? "hidden sm:flex" : ""
              )}
              style={{
                ...customStyles?.suggestionButton,
                border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <span className="text-xs sm:text-sm whitespace-nowrap">
                {suggestion.text}
              </span>
              <ArrowUpRight className="ml-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 group-hover:opacity-70" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
