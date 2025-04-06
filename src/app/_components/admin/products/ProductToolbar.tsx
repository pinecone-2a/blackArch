"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Plus, Search, Filter, ArrowUpDown, Download } from "lucide-react";

interface ProductToolbarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    categories: { id: string; name: string }[];
    sortBy: string;
    setSortBy: (value: string) => void;
    selectedProducts: string[];
    handleBulkDelete: () => Promise<void>;
    setIsDialogOpen: (value: boolean) => void;
}

const ProductToolbar = ({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortBy,
    setSortBy,
    selectedProducts,
    handleBulkDelete,
    setIsDialogOpen
}: ProductToolbarProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Products</h2>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select
                        value={categoryFilter === "" ? "all" : categoryFilter}
                        onValueChange={(value) => setCategoryFilter(value === "all" ? "" : value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                            <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
                            <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="flex items-center justify-between">
                <div>
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
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>
        </div>
    );
};

export default ProductToolbar; 