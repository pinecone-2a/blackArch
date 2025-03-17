"use client";
import Image from "next/image";
import { useState } from "react";
import { Pen, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0] && files[0].type.startsWith("image/")) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white my-5 w-[77%] mx-auto rounded-3xl p-6 relative">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="absolute top-6 right-6 h-12 w-32 rounded-3xl text-md flex items-center justify-center">
                        <Plus className="mr-2 w-5 h-5" /> Add Item
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Add Your Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center">
                            {image && (
                                <Image 
                                    src={typeof image === "string" ? image : ""} 
                                    alt="Preview" 
                                    width={350} 
                                    height={350} 
                                    className="rounded-lg mb-2" 
                                />
                            )}
                            <input  type="file" accept="image/*" onChange={handleImageChange} className="rounded-2xl p-3 bg-gray-100 border-2" />
                        </div>

                        <div className="flex gap-3"> 
                            <Input className="rounded-2xl p-3 h-12 bg-gray-100 border-2" placeholder="Product Name" />
                            <Input className="rounded-2xl p-3 h-12 bg-gray-100 border-2" placeholder="Enter Price" type="number" />
                        </div>
                        <Select>
                            <SelectTrigger className="w-full rounded-2xl p-3  bg-gray-100 border-2">
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
            
            <h1 className="text-2xl font-bold">Our Products</h1>
            <div className="w-[260px] h-auto rounded-2xl p-5 flex flex-col items-center border mt-6 border-gray-200">
                <Image
                    src="/podolk.png"
                    width={160}
                    height={160}
                    alt="Black Podolk"
                    className="rounded-lg"
                />
                <h1 className="text-lg font-semibold mt-3 text-gray-800">Black Podolk</h1>
                <p className="text-md font-medium text-gray-600 mt-1">$5000</p>
                <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100">
                        <Pen className="mr-1 w-4 h-4" /> Edit
                    </Button>
                    <Button variant="destructive" className="bg-red-500 rounded-2xl hover:bg-red-600">
                        <Trash className="mr-1 w-4 h-4 " /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
