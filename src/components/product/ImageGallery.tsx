"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ImageGallery({ images, productName, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full bg-gray-light overflow-hidden">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          data-placeholder="true"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-20 h-24 bg-gray-light overflow-hidden border-2 transition-all duration-300",
                selectedIndex === index
                  ? "border-black"
                  : "border-transparent hover:border-border"
              )}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={image}
                alt={`${productName} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                data-placeholder="true"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
