"use client";

import Icon from "@/components/Icon";
import { cn } from "@/utils/className";
import React, { useState, useRef } from "react";

interface MapSearchInputProps {
  onSearch?: (term: string) => void;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export default function MapSearchInput({
  onSearch,
  errorMessage,
  onClearError,
}: MapSearchInputProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isExpanded = isHovered || isFocused || searchTerm.length > 0;

  const handleContainerClick = () => {
    if (!isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onClearError) {
      onClearError();
    }
  };

  return (
    <div className="absolute top-4 left-4 z-1000 flex flex-col gap-1 items-start">
      <div
        className={cn(
          "flex items-center bg-black/50 p-1 rounded-xl backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out cursor-text h-11",
          isExpanded ? "w-80" : "w-11"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleContainerClick}
      >
        <div className="shrink-0 w-8.5 h-full flex items-center justify-center text-white">
          <Icon name="search" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Pesquisar por um endereço"
          className={cn(
            "w-full h-full px-2 outline-none text-sm font-medium text-white bg-transparent placeholder-white/70 transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {isExpanded && errorMessage && (
        <div className="w-80 px-4 py-3 text-sm text-warning font-medium bg-warning-50 rounded-lg shadow-md animate-pop-in-soft">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
