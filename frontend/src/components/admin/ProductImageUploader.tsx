import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

interface ProductImageUploaderProps {
  onImageChange: (image: ExternalBlob | null) => void;
  currentImage?: ExternalBlob;
  disabled?: boolean;
}

export default function ProductImageUploader({ 
  onImageChange, 
  currentImage,
  disabled = false 
}: ProductImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImage ? currentImage.getDirectURL() : null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      onImageChange(blob);
      toast.success('Image ready for upload');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
      onImageChange(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="product-image">Product Image *</Label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Product preview"
            className="h-48 w-full rounded-sm object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-sm">
              <div className="text-center text-white">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                <p className="text-sm">{uploadProgress}%</p>
              </div>
            </div>
          )}
          {!disabled && !isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-sm border-2 border-dashed border-border bg-muted/30 p-12">
          <div className="text-center">
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="product-image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />
      
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  );
}
