"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImageUploaderProps {
    initialImage?: string;
    onImageCropped: (imageUrl: string) => void;
}

const ProductImageUploader = ({ initialImage, onImageCropped }: ProductImageUploaderProps) => {
    const [image, setImage] = useState<string | null>(initialImage || null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
    const [croppedImage, setCroppedImage] = useState<string | null>(initialImage || null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                // Reset crop state when new image is uploaded
                setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
                setCroppedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // This is called when the user has finished drawing the crop box
    const onCropComplete = (crop: Crop) => {
        if (crop.width && crop.height) {
            setCrop(crop);
        }
    };

    const onImageLoaded = (img: HTMLImageElement) => {
        setImageRef(img);
        return false; // Return false to prevent setting completion
    };
    
    const uploadToCloudinary = async (blob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", blob);
            
            // The upload preset should start with "unsigned_" for client-side uploads
            const uploadPreset = "unsigned_pineshop";
            formData.append("upload_preset", uploadPreset);
            
            const cloudName = "dkfnzxaid";
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });
            
            if (!res.ok) {
                throw new Error(`Failed to upload image to Cloudinary. Status: ${res.status}`);
            }
            
            const data = await res.json();
            return data.secure_url;
        } catch (error) {
            console.error("Upload to Cloudinary failed:", error);
            throw error;
        }
    };
    
    const getCroppedImage = async () => {
        if (!imageRef || !image) {
            toast.error("Image processing failed. Please try again.");
            return;
        }
        
        setLoading(true);
        
        try {
            // Create a canvas element for the cropped image
            const canvas = document.createElement("canvas");
            
            // Calculate scaling factors between displayed size and natural size
            const scaleX = imageRef.naturalWidth / imageRef.width;
            const scaleY = imageRef.naturalHeight / imageRef.height;
            
            // Calculate crop dimensions in pixels based on the unit
            let pixelCrop;
            if (crop.unit === '%') {
                // Convert percentage to pixels
                pixelCrop = {
                    x: (crop.x * imageRef.naturalWidth) / 100,
                    y: (crop.y * imageRef.naturalHeight) / 100,
                    width: (crop.width * imageRef.naturalWidth) / 100,
                    height: (crop.height * imageRef.naturalHeight) / 100
                };
            } else {
                // Convert display pixels to actual pixels
                pixelCrop = {
                    x: crop.x * scaleX,
                    y: crop.y * scaleY,
                    width: crop.width * scaleX,
                    height: crop.height * scaleY
                };
            }
            
            // Ensure the crop dimensions don't exceed the image boundaries
            pixelCrop.x = Math.max(0, pixelCrop.x);
            pixelCrop.y = Math.max(0, pixelCrop.y);
            pixelCrop.width = Math.min(pixelCrop.width, imageRef.naturalWidth - pixelCrop.x);
            pixelCrop.height = Math.min(pixelCrop.height, imageRef.naturalHeight - pixelCrop.y);
            
            // Set canvas size to match the crop size
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }
            
            // Draw only the cropped portion of the image to the canvas
            ctx.drawImage(
                imageRef,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            
            // Convert canvas to a data URL
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            
            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            // Upload the blob to Cloudinary
            const imageUrl = await uploadToCloudinary(blob);
            
            setCroppedImage(imageUrl);
            onImageCropped(imageUrl);
            
            toast.success("Image cropped and uploaded successfully");
        } catch (error) {
            console.error("Error processing image:", error);
            toast.error("Failed to process image. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);
    
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
            />
            
            {!image ? (
                <Card 
                    className="border-dashed border-2 p-12 h-[300px] flex flex-col items-center justify-center cursor-pointer"
                    onClick={triggerFileInput}
                >
                    <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center mb-2">
                        Click to upload product image
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                        Supports: JPG, PNG, WebP
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={onCropComplete}
                    >
                        <img 
                            src={image} 
                            alt="Product" 
                            className="max-h-[350px] w-full object-contain"
                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                        />
                    </ReactCrop>
                    
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={triggerFileInput}
                            className="flex-1"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Image
                        </Button>
                        <Button
                            type="button"
                            onClick={getCroppedImage}
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Crop & Upload"
                            )}
                        </Button>
                    </div>
                    
                    {croppedImage && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <img 
                                src={croppedImage} 
                                alt="Cropped Preview" 
                                className="max-h-[150px] w-full object-contain border rounded"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductImageUploader; 