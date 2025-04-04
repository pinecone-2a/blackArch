"use client";
import Image from "next/image";
import { useState } from "react";
import { Pen, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminCategoryComp from "./adminCategory";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // Ensure you import the CSS
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminProductsComp() {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,  
    });
    
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0] && files[0].type.startsWith("image/")) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setCroppedImage(null); // Reset cropped image
            };
            reader.readAsDataURL(file);
        }
    };

    const getCroppedImage = async () => {
        if (!imageRef || !image) return;
        
        const canvas = document.createElement("canvas");
        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const croppedWidth = crop.width ? crop.width * scaleX : 0;
        const croppedHeight = crop.height ? crop.height * scaleY : 0;

        canvas.width = croppedWidth;
        canvas.height = croppedHeight;

        ctx.drawImage(
            imageRef,
            crop.x * scaleX,
            crop.y * scaleY,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
        );

        const croppedImageURL = canvas.toDataURL("image/png");
        setCroppedImage(croppedImageURL);
    };

    return (
        <div className="bg-white my-5 w-11/12 mx-auto rounded-3xl p-6 relative">
            <AdminCategoryComp />
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Our Products</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-32 h-12 rounded-3xl text-md flex items-center justify-center">
                            <Plus className="mr-2 w-5 h-5" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Add Your Product</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                {image && !croppedImage && (
                                <ReactCrop 
                                crop={crop} 
                                onChange={(c) => setCrop(c)}
                                aspect={1} // Ensure cropping remains square
                            >
                                <img 
                                    src={image} 
                                    alt="To Crop"
                                    ref={(img) => setImageRef(img)}
                                    className="rounded-lg"
                                />
                            </ReactCrop>
                            
                                )}
                                {croppedImage && (
                                    <Image 
                                        src={croppedImage} 
                                        alt="Cropped Preview" 
                                        width={350} 
                                        height={350} 
                                        className="rounded-lg mb-2" 
                                    />
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="rounded-2xl p-3 bg-gray-100 border-2" />
                                {image && <Button onClick={getCroppedImage} className="mt-2">Crop & Save</Button>}
                            </div>

                            <div className="flex gap-3">
                                <Input className="rounded-2xl p-3 h-12 bg-gray-100 border-2" placeholder="Product Name" />
                                <Input className="rounded-2xl p-3 h-12 bg-gray-100 border-2" placeholder="Enter Price" type="number" />
                            </div>
                            <Select>
                                <SelectTrigger className="w-full rounded-2xl p-3 bg-gray-100 border-2">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="men">Men</SelectItem>
                                    <SelectItem value="women">Women</SelectItem>
                                    <SelectItem value="sport">Sport</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="w-full rounded-2xl text-md">Submit</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
