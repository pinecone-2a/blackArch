"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Check, XCircle } from 'lucide-react';
import ReactCrop, { Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ProductImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  aspectRatio?: number;
}

export default function ProductImageUploader({ 
  onImagesChange, 
  initialImages = [], 
  maxImages = 5,
  aspectRatio = 1 // 1:1 aspect ratio by default
}: ProductImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_pineshop');
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkfnzxaid';
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      console.log('Uploading to Cloudinary:', uploadUrl);
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload error:", errorData);
        throw new Error('Failed to upload to Cloudinary');
      }
      
      const data = await response.json();
      console.log('Cloudinary upload success:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Check if we would exceed the maximum number of images
    if (images.length + e.target.files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    // Store all files and start with the first one
    const files = Array.from(e.target.files);
    setCurrentFiles(files);
    setCurrentFileIndex(0);
    setCurrentFile(files[0]);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setCropDialogOpen(true);
    });
    reader.readAsDataURL(files[0]);
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Create a centered crop with the specified aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(crop);
  };

  const cropImage = async () => {
    if (!completedCrop || !imageRef.current || !currentFile) {
      console.error("Missing required data for crop:", {
        hasCrop: !!completedCrop,
        hasImageRef: !!imageRef.current,
        hasFile: !!currentFile
      });
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const image = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Calculate pixel values from percentage values
      const scaleX = image.naturalWidth / 100;
      const scaleY = image.naturalHeight / 100;
      
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      // Set canvas size to the cropped size
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped image
      ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Instead of using toBlob which can cause issues, use toDataURL
      try {
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        
        // Convert base64 to blob
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        console.log("Generated blob:", blob.type, Math.round(blob.size / 1024), "KB");
        
        // Create a new file from the blob
        const fileName = currentFile.name.split('.')[0] + ".jpg";
        const croppedFile = new File([blob], fileName, { 
          type: 'image/jpeg'
        });
        
        console.log("Uploading cropped file to Cloudinary...");
        
        // Upload directly to Cloudinary
        const uploadedUrl = await uploadToCloudinary(croppedFile);
        console.log("Received URL from Cloudinary:", uploadedUrl);
        
        const newImages = [...images, uploadedUrl];
        
        setImages(newImages);
        onImagesChange(newImages);

        // All files processed, close the dialog
        setCropDialogOpen(false);
        setCurrentFile(null);
        setImgSrc('');
        setCurrentFiles([]);
        setCurrentFileIndex(0);
        
      } catch (error) {
        console.error('Error in image upload process:', error);
        setError('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    } catch (error) {
      console.error('Error during image crop:', error);
      setError('Failed to process image. Please try again.');
      setUploading(false);
    }
  };

  const cancelCrop = () => {
    setCropDialogOpen(false);
    setCurrentFile(null);
    setImgSrc('');
    setCurrentFiles([]);
    setCurrentFileIndex(0);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
    setError(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square w-32 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <img 
                      src={image} 
                      alt={`Product image ${index + 1}`} 
                      className="max-w-full max-h-full"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-1.5 font-medium">
                      Main Image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {images.length < maxImages && (
            <div className="col-span-2 border rounded-lg p-6 bg-gray-50">
              <h3 className="text-base font-medium mb-3">Add Product Images</h3>
              <div className="w-full">
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Upload Images</span>
                      <p className="text-xs text-gray-500 px-4 text-center mt-1">
                        Images will be cropped to a 1:1 aspect ratio
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tips:</span> Upload up to {maxImages} images. First image will be used as the main product image. 
                  All images will be cropped to ensure consistent dimensions.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Crop Product Image {currentFileIndex + 1} of {currentFiles.length}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {imgSrc && (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">
                    Drag the corners of the box to adjust the crop area. Using a 1:1 square ratio for all product images.
                  </p>
                </div>
                <div className="w-full">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    className="mx-auto border rounded shadow-sm"
                  >
                    <img
                      ref={imageRef}
                      alt="Crop preview"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[520px] w-auto"
                    />
                  </ReactCrop>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button" 
              variant="outline" 
              onClick={cancelCrop}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={cropImage}
              disabled={!completedCrop || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Crop & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 