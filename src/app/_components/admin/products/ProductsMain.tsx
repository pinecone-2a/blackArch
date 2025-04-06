"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductToolbar from "./ProductToolbar";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import ProductTable from "./ProductTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const ProductsMain = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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

    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.categoryId === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    // Sort products based on sort selection
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "stock-asc":
                return a.quantity - b.quantity;
            case "stock-desc":
                return b.quantity - a.quantity;
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "newest":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    const handleEdit = (productId: string) => {
        const productToEdit = products.find(p => p.id === productId);
        if (productToEdit) {
            setEditMode(true);
            setEditProductId(productId);
            setIsDialogOpen(true);
        }
    };

    const handleDelete = async (productId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
                toast.success("Product deleted successfully");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const handleSelectProduct = (productId: string, checked: boolean) => {
        if (checked) {
            setSelectedProducts(prev => [...prev, productId]);
        } else {
            setSelectedProducts(prev => prev.filter(id => id !== productId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        
        try {
            const promises = selectedProducts.map(id => 
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );
            
            await Promise.all(promises);
            
            setProducts(products.filter(p => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
            toast.success(`${selectedProducts.length} products deleted successfully`);
        } catch (error) {
            console.error("Error during bulk delete:", error);
            toast.error("Failed to delete some products");
        }
    };

    return (
        <div className="space-y-4">
            <ProductToolbar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedProducts={selectedProducts}
                handleBulkDelete={handleBulkDelete}
                setIsDialogOpen={setIsDialogOpen}
            />
            
            <Tabs defaultValue="grid" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="grid" className="m-0">
                    {loading ? (
                        <div className="py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : (
                        <ProductGrid 
                            products={sortedProducts}
                            categories={categories}
                            selectedProducts={selectedProducts}
                            handleSelectProduct={handleSelectProduct}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </TabsContent>
                
                <TabsContent value="table" className="m-0">
                    {loading ? (
                        <div className="py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : (
                        <ProductTable 
                            products={sortedProducts}
                            categories={categories}
                            selectedProducts={selectedProducts}
                            handleSelectProduct={handleSelectProduct}
                            handleSelectAll={handleSelectAll}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </TabsContent>
            </Tabs>
            
            <ProductForm 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                editMode={editMode}
                editProductId={editProductId}
                products={products}
                categories={categories}
                onProductSaved={() => {
                    fetchProducts();
                    setEditMode(false);
                    setEditProductId(null);
                }}
            />
        </div>
    );
};

export default ProductsMain; 