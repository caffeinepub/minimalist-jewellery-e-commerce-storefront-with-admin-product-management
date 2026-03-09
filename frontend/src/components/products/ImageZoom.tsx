import { useState } from 'react';
import type { ExternalBlob } from '@/backend';
import { ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageZoomProps {
  image: ExternalBlob;
  alt: string;
}

export default function ImageZoom({ image, alt }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrl = image.getDirectURL();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="group relative aspect-square w-full overflow-hidden rounded-sm bg-muted focus-visible-ring"
          aria-label="Zoom image"
        >
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
            <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <img
          src={imageUrl}
          alt={alt}
          className="h-auto w-full rounded-sm"
        />
      </DialogContent>
    </Dialog>
  );
}
