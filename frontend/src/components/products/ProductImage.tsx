import { useState } from 'react';
import type { ExternalBlob } from '@/backend';

interface ProductImageProps {
  image: ExternalBlob;
  alt: string;
  className?: string;
}

export default function ProductImage({ image, alt, className = '' }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = image.getDirectURL();

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
