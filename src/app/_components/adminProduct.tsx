"use client";
import Image from "next/image";
import { useState } from "react";
import { Pen, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminCategoryComp from "./adminCategory";
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
            <AdminCategoryComp/>
            <div className="flex justify-between"> 
            <h1 className="text-2xl font-bold">Our Products</h1> 
            <Dialog>
                <DialogTrigger asChild>
                    <Button className=" top-[330px]  w-32 rounded-3xl text-md flex items-center justify-center">
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
            
           
            </div>
            <div className="group bg-white w-[300px] h-[300px] rounded-xl border flex flex-col items-center">
    <Image className="mt-6" src="/t-shirt.png" width={150} height={150} alt="T-shirt" />
    <p className="mt-5 text-center font-semibold text-gray-800">
        T-shirt with Tape Details
    </p>
    <div className="my-1 text-lg font-bold text-gray-700">$130</div>
    <div className="w-full p-0 flex justify-between">
    <button
        className="w-[50%] border-t border h-[50px] duration-200 rounded-bl-xl rounded-t-none hover:bg-gray-100 text-gray-700 px-4 py-2"
    >
        Edit
    </button>
    <button
        className="w-[50%] border-t border duration-200 h-[50px] rounded-br-xl rounded-t-none bg-red-500 hover:bg-red-600 px-4 py-2"
    >
        Delete
    </button>
</div>




</div>


        </div>
    );
}
