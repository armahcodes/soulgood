"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 bg-white border-b border-border z-40 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
        isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
      )}
      role="search"
      aria-label="Site search"
    >
      <div className="max-container px-8 py-8">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="search"
            placeholder="Search Soul Good..."
            className="flex-1 bg-transparent border-0 border-b border-border px-0 py-3 font-body text-lg text-black placeholder:text-black/40 focus:border-black focus:outline-none transition-colors duration-300"
            aria-label="Search"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream transition-colors duration-300"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
