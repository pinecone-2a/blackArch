"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload, Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    const [showCropDialog, setShowCropDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
                setCroppedImage(null);
                setShowCropDialog(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (crop: Crop) => {
        if (crop.width && crop.height) {
            setCrop(crop);
        }
    };

    const onImageLoaded = (img: HTMLImageElement) => {
        setImageRef(img);
        return false;
    };
    
    const uploadToCloudinary = async (blob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", "unsigned_pineshop");
            
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
            const canvas = document.createElement("canvas");
            const scaleX = imageRef.naturalWidth / imageRef.width;
            const scaleY = imageRef.naturalHeight / imageRef.height;
            
            let pixelCrop;
            if (crop.unit === '%') {
                pixelCrop = {
                    x: (crop.x * imageRef.naturalWidth) / 100,
                    y: (crop.y * imageRef.naturalHeight) / 100,
                    width: (crop.width * imageRef.naturalWidth) / 100,
                    height: (crop.height * imageRef.naturalHeight) / 100
                };
            } else {
                pixelCrop = {
                    x: crop.x * scaleX,
                    y: crop.y * scaleY,
                    width: crop.width * scaleX,
                    height: crop.height * scaleY
                };
            }
            
            pixelCrop.x = Math.max(0, pixelCrop.x);
            pixelCrop.y = Math.max(0, pixelCrop.y);
            pixelCrop.width = Math.min(pixelCrop.width, imageRef.naturalWidth - pixelCrop.x);
            pixelCrop.height = Math.min(pixelCrop.height, imageRef.naturalHeight - pixelCrop.y);
            
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }
            
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
            
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            const imageUrl = await uploadToCloudinary(blob);
            
            setCroppedImage(imageUrl);
            onImageCropped(imageUrl);
            setShowCropDialog(false);
            
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

    const handleCancel = () => {
        setShowCropDialog(false);
        setImage(null);
        setCroppedImage(null);
    };
    
    return (
        <div className="space-y-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
            />
            
            {!croppedImage ? (
                <Card 
                    className="border-dashed border-2 p-12 h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={triggerFileInput}
                >
                    <div className="bg-gray-50 rounded-full p-4 mb-4">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-center mb-2 font-medium">
                        Click to upload product image
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                        Supports: JPG, PNG, WebP
                    </p>
                </Card>
            ) : (
                <div className="relative group">
                    <Card className="overflow-hidden">
                        <div className="relative aspect-square">
                            <img 
                                src={croppedImage} 
                                alt="Product" 
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
                                    onClick={triggerFileInput}
                                >
                                    <Upload className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
                        onClick={() => {
                            setCroppedImage(null);
                            onImageCropped("");
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Crop Product Image</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        {image && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-center mb-2">
                                    <p className="text-sm text-gray-600">
                                        Drag the corners of the box to adjust the crop area. Using a 1:1 square ratio for product images.
                                    </p>
                                </div>
                                <div className="w-full">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={onCropComplete}
                                        aspect={1}
                                    >
                                        <img 
                                            src={image} 
                                            alt="Product" 
                                            className="max-h-[500px] w-full object-contain"
                                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                                        />
                                    </ReactCrop>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={getCroppedImage}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Crop & Upload
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductImageUploader; 