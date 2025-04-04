"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Pen, Trash, Plus, Search, Filter, ArrowUpDown, Download, Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";



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

export default function AdminProductsComp() {
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
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
    

    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setPrice(isNaN(value) ? 0 : value);
      };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(isNaN(value) ? 1 : value);
    };      

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);
    

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products`);
            const data = await response.json();
            if (data.message && Array.isArray(data.message)) {
                setProducts(data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}category`);
            const data = await response.json();
            if (data.message && Array.isArray(data.message)) {
                setCategories(data.message);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    };
    

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0] && files[0].type.startsWith("image/")) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setCroppedImage(null);
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
        
        setSubmitting(true);
        
        try {
            const productData = {
                name: productForm.name,
                description: productForm.description,
                price: parseInt(productForm.price) , // Convert to cents
                quantity: parseInt(productForm.quantity),
                image: croppedImage || "/t-shirt.png", // Default image if none provided
                categoryId: productForm.categoryId,
                color: productForm.color,
                size: productForm.size,
                rating: 0,
            };
            
            let response;
            
            if (editMode && editProductId) {
                // Update existing product
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/${editProductId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                });
            } else {
                // Add new product
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                });
            }
            
            if (response.ok) {
                toast.success(editMode ? "Product updated successfully" : "Product added successfully");
                fetchProducts();
                // Reset form
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to process product");
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            toast.error(editMode ? "Failed to update product" : "Failed to add product");
        } finally {
            setSubmitting(false);
        }
    };
    
    // Reset form
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
        setImage(null);
        setCroppedImage(null);
        setEditMode(false);
        setEditProductId(null);
    };
    
    const handleEdit = (productId: string) => {
        const productToEdit = products.find(p => p.id === productId);
        if (productToEdit) {
            setEditMode(true);
            setEditProductId(productId);
            setProductForm({
                name: productToEdit.name,
                description: productToEdit.description || "",
                price: String(productToEdit.price), // Convert from cents
                quantity: String(productToEdit.quantity),
                categoryId: productToEdit.categoryId,
                image: productToEdit.image || "",
                color: Array.isArray(productToEdit.color) ? [...productToEdit.color] : [],
                size: Array.isArray(productToEdit.size) ? [...productToEdit.size] : [],
            });
            setCroppedImage(productToEdit.image as string);
        }
    };
    
    // Handler for deleting a product
    const handleDelete = async (productId: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/${productId}`, {
                    method: "DELETE",
                });
                
                if (response.ok) {
                    toast.success("Product deleted successfully");
                    fetchProducts();
                } else {
                    throw new Error("Failed to delete product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };
    
    // Handle product selection for bulk actions
    const handleSelectProduct = (productId: string, checked: boolean) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId]);
        } else {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        }
    };
    
    // Handle select all
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            try {
                // Sequential deletion for multiple products
                const deletePromises = selectedProducts.map(productId => 
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/${productId}`, {
                        method: "DELETE",
                    })
                );
                
                await Promise.all(deletePromises);
                
                toast.success(`${selectedProducts.length} products deleted successfully`);
                fetchProducts();
                setSelectedProducts([]);
            } catch (error) {
                console.error("Error deleting products:", error);
                toast.error("Failed to delete some products");
            }
        }
    };
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter.toLowerCase() : true;
        return matchesSearch && matchesCategory;
    });
    
    
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "price-high") {
            return b.price - a.price;
        } else if (sortBy === "price-low") {
            return a.price - b.price;
        } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

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
        <div className="flex-1 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Бүтээгдэхүүн</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Бүтээгдэхүүн нэмэх
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editMode ? "Edit Product" : "Add New Product"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details to {editMode ? "update" : "create"} a product.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                                {image && !croppedImage ? (
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        aspect={1}
                                    >
                                        <img
                                            src={image}
                                            alt="Product Preview"
                                            ref={(img) => setImageRef(img)}
                                            className="max-h-[300px] rounded-md"
                                        />
                                    </ReactCrop>
                                ) : croppedImage ? (
                                    <div className="w-full flex justify-center">
                                        <Image
                                            src={croppedImage}
                                            alt="Cropped Preview"
                                            width={200}
                                            height={200}
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full flex justify-center">
                                        <div className="w-[200px] h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex gap-2 w-full">
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="flex-1"
                                    />
                                    {image && !croppedImage && (
                                        <Button onClick={getCroppedImage} type="button">
                                            Crop
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Бүтээгдэхүүний Нэр
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={productForm.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium">
                                        Category*
                                    </label>
                                    <Select 
                                        value={productForm.categoryId} 
                                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem 
                                                    key={category.id} 
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="price" className="text-sm font-medium">
                                        Price ($)*
                                    </label>
                                    <Input
                                        id="price"
                                        name="price"
                                        value={productForm.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="quantity" className="text-sm font-medium">
                                        Quantity*
                                    </label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        value={productForm.quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        type="number"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Нэмэлт мэдээлэл
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={productForm.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter product description"
                                    rows={3}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Өнгөнүүд*</label>
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
                                            <label 
                                                htmlFor={`color-${color.value}`}
                                                className="text-sm flex items-center gap-2"
                                            >
                                                <span 
                                                    className="w-4 h-4 rounded-full inline-block border border-gray-200"
                                                    style={{ backgroundColor: color.hex }}
                                                ></span>
                                                {color.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sizes*</label>
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
                                            <label 
                                                htmlFor={`size-${size}`}
                                                className="text-sm"
                                            >
                                                {size}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={resetForm} type="button" disabled={submitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {editMode ? "Updating..." : "Adding..."}
                                    </>
                                ) : (
                                    editMode ? "Update Product" : "Add Product"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="flex flex-col gap-6">
                {/* Filters and search */}
                <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            className="pl-10"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* Products table */}
                <Card>
                    <CardContent className="p-0">
                        <Tabs defaultValue="grid" className="w-full">
                            <div className="flex justify-between items-center p-4 border-b">
                                <div className="flex items-center gap-2">
                                    <TabsList>
                                        <TabsTrigger value="grid">Grid View</TabsTrigger>
                                        <TabsTrigger value="table">Table View</TabsTrigger>
                                    </TabsList>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {filteredProducts.length} products
                                    </span>
                                    
                                    {selectedProducts.length > 0 && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={handleBulkDelete}
                                        >
                                            Delete Selected ({selectedProducts.length})
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <TabsContent value="grid" className="m-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                    {loading ? (
                                        <div className="col-span-4 py-8 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-500">Loading products...</p>
                                        </div>
                                    ) : sortedProducts.length > 0 ? (
                                        sortedProducts.map((product) => (
                                            <Card key={product.id} className="overflow-hidden flex flex-col">
                                                <div className="relative">
                                                    <div className="relative h-48 bg-gray-100">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <Checkbox
                                                            checked={selectedProducts.includes(product.id)}
                                                            onCheckedChange={(checked) => 
                                                                handleSelectProduct(product.id, checked as boolean)
                                                            }
                                                            className="h-5 w-5 bg-white/80"
                                                        />
                                                    </div>
                                                </div>
                                                <CardContent className="p-4 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-semibold truncate">{product.name}</h3>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {categories.find(c => c.id === product.categoryId)?.name || "Unknown Category"}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline" className="bg-gray-100 font-semibold text-[18px]">
                                                        ₮{(product.price).toFixed(2)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                        {product.description || "No description available"}
                                                    </p>
                                                    <div className="flex gap-1 mb-2">
                                                        {product.color.slice(0, 3).map((col: string) => (
                                                            <span 
                                                                key={col}
                                                                className="w-4 h-4 rounded-full inline-block border border-gray-200"
                                                                style={{ 
                                                                    backgroundColor: colors.find((c: { value: string; hex: string }) => c.value === col)?.hex || col 
                                                                }}
                                                                title={colors.find((c: { value: string; name: string }) => c.value === col)?.name || col}
                                                            ></span>
                                                        ))}
                                                        {product.color.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{product.color.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 mb-3">
                                                        {product.size.slice(0, 4).map((s: string) => (
                                                            <span key={s} className="text-xs border rounded px-1.5 py-0.5">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {product.size.length > 4 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{product.size.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-auto flex justify-between items-center">
                                                        <div className="text-sm">
                                                            <span className={`${
                                                                product.quantity > 10 
                                                                    ? "text-green-600" 
                                                                    : product.quantity > 0 
                                                                        ? "text-yellow-600" 
                                                                        : "text-red-600"
                                                            } font-medium`}>
                                                                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon"
                                                                onClick={() => handleEdit(product.id)}
                                                            >
                                                                <Pen className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon"
                                                                onClick={() => handleDelete(product.id)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="col-span-4 py-8 text-center">
                                            <p className="text-gray-500">No products found</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="table" className="m-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                <th className="px-4 py-3 w-10">
                                                    <Checkbox
                                                        checked={
                                                            filteredProducts.length > 0 &&
                                                            selectedProducts.length === filteredProducts.length
                                                        }
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th className="px-4 py-3">Product</th>
                                                <th className="px-4 py-3">Category</th>
                                                <th className="px-4 py-3">Price</th>
                                                <th className="px-4 py-3">Stock</th>
                                                <th className="px-4 py-3">Created</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-8 text-center">
                                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                                                        <p className="text-gray-500">Loading products...</p>
                                                    </td>
                                                </tr>
                                            ) : sortedProducts.length > 0 ? (
                                                sortedProducts.map((product) => (
                                                    <tr key={product.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <Checkbox
                                                                checked={selectedProducts.includes(product.id)}
                                                                onCheckedChange={(checked) => 
                                                                    handleSelectProduct(product.id, checked as boolean)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100">
                                                                    <Image
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{product.name}</div>
                                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                                        {product.description || "No description"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {categories.find(c => c.id === product.categoryId)?.name || "Unknown Category"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            ${(product.price / 100).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                product.quantity > 10 
                                                                    ? "bg-green-100 text-green-800" 
                                                                    : product.quantity > 0 
                                                                        ? "bg-yellow-100 text-yellow-800" 
                                                                        : "bg-red-100 text-red-800"
                                                            }`}>
                                                                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {/* {product.createdAt.toLocaleDateString()} */}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleEdit(product.id)}
                                                                >
                                                                    <Pen className="h-4 w-4 mr-1" /> Edit
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                >
                                                                    <Trash className="h-4 w-4 mr-1" /> Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                        No products found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}