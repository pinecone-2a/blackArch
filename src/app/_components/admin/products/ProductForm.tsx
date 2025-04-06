"use client";

import { useState, useEffect } from "react";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProductImageUploader from "./ProductImageUploader";

// Define constants for colors and sizes
const colors = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Gray", value: "gray", hex: "#808080" },
    { name: "Navy", value: "navy", hex: "#000080" },
    { name: "Red", value: "red", hex: "#ff0000" },
    { name: "Blue", value: "blue", hex: "#0000ff" },
    { name: "Green", value: "green", hex: "#008000" },
    { name: "Yellow", value: "yellow", hex: "#ffff00" },
    { name: "Pink", value: "pink", hex: "#ffc0cb" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

interface ProductFormProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    editMode: boolean;
    editProductId: string | null;
    products: any[];
    categories: { id: string; name: string }[];
    onProductSaved: () => void;
}

const ProductForm = ({
    isOpen,
    setIsOpen,
    editMode,
    editProductId,
    products,
    categories,
    onProductSaved
}: ProductFormProps) => {
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        image: "",
        color: [] as string[],
        size: [] as string[],
    });
    
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Reset form when dialog opens/closes or edit mode changes
    useEffect(() => {
        if (isOpen) {
            if (editMode && editProductId) {
                const productToEdit = products.find(p => p.id === editProductId);
                if (productToEdit) {
                    setProductForm({
                        name: productToEdit.name || "",
                        description: productToEdit.description || "",
                        price: productToEdit.price.toString() || "",
                        quantity: productToEdit.quantity.toString() || "",
                        categoryId: productToEdit.categoryId || "",
                        image: productToEdit.image || "",
                        color: productToEdit.color || [],
                        size: productToEdit.size || [],
                    });
                    setCroppedImage(productToEdit.image);
                }
            } else {
                resetForm();
            }
        }
    }, [isOpen, editMode, editProductId, products]);

    const resetForm = () => {
        setProductForm({
            name: "",
            description: "",
            price: "",
            quantity: "",
            categoryId: "",
            image: "",
            color: [],
            size: [],
        });
        setCroppedImage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (colorValue: string, checked: boolean) => {
        if (checked) {
            setProductForm(prev => ({ 
                ...prev, 
                color: [...prev.color, colorValue] 
            }));
        } else {
            setProductForm(prev => ({ 
                ...prev, 
                color: prev.color.filter(c => c !== colorValue) 
            }));
        }
    };

    const handleSizeChange = (size: string, checked: boolean) => {
        if (checked) {
            setProductForm(prev => ({ 
                ...prev, 
                size: [...prev.size, size] 
            }));
        } else {
            setProductForm(prev => ({ 
                ...prev, 
                size: prev.size.filter(s => s !== size) 
            }));
        }
    };

    const handleSubmit = async () => {
        if (!productForm.name || !productForm.price || !productForm.quantity || !productForm.categoryId || productForm.color.length === 0 || productForm.size.length === 0) {
            toast.error("Please fill out all required fields");
            return;
        }
        
        // Check if we have an image
        if (!editMode && !croppedImage) {
            toast.warning("Please upload an image for the product");
            return;
        }
        
        setSubmitting(true);
        
        try {
            const productData = {
                name: productForm.name,
                description: productForm.description,
                price: parseInt(productForm.price),
                quantity: parseInt(productForm.quantity),
                image: croppedImage || productForm.image, 
                categoryId: productForm.categoryId,
                color: productForm.color,
                size: productForm.size,
                rating: 0,
            };
            
            let response;
            
            if (editMode && editProductId) {
                // Update existing product
                response = await fetch(`/api/products`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editProductId,
                        ...productData
                    }),
                });
            } else {
                // Create new product
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                });
            }
            
            if (response.ok) {
                toast.success(editMode ? "Product updated successfully" : "Product created successfully");
                onProductSaved();
                setIsOpen(false);
                resetForm();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to save product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Product name"
                                value={productForm.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Product description"
                                value={productForm.description}
                                onChange={handleInputChange}
                                rows={5}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={productForm.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Stock Quantity <span className="text-red-500">*</span></Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    placeholder="0"
                                    value={productForm.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Select
                                value={productForm.categoryId}
                                onValueChange={(value) => handleSelectChange("categoryId", value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label className="block mb-2">Colors <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-3 gap-2">
                                {colors.map((color) => (
                                    <div key={color.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`color-${color.value}`}
                                            checked={productForm.color.includes(color.value)}
                                            onCheckedChange={(checked) => 
                                                handleColorChange(color.value, checked as boolean)
                                            }
                                        />
                                        <Label
                                            htmlFor={`color-${color.value}`}
                                            className="flex items-center text-sm font-normal"
                                        >
                                            <span
                                                className="w-4 h-4 mr-1 rounded-full inline-block border border-gray-200"
                                                style={{ backgroundColor: color.hex }}
                                            ></span>
                                            {color.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <Label className="block mb-2">Sizes <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <div key={size} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`size-${size}`}
                                            checked={productForm.size.includes(size)}
                                            onCheckedChange={(checked) => 
                                                handleSizeChange(size, checked as boolean)
                                            }
                                        />
                                        <Label
                                            htmlFor={`size-${size}`}
                                            className="text-sm font-normal"
                                        >
                                            {size}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <Label className="block mb-2">Product Image <span className="text-red-500">*</span></Label>
                        <ProductImageUploader 
                            initialImage={editMode ? productForm.image : undefined}
                            onImageCropped={(imageUrl) => setCroppedImage(imageUrl)}
                        />
                    </div>
                </div>
                
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {editMode ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            editMode ? "Update Product" : "Create Product"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProductForm; 