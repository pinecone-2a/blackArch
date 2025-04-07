"use client";

import Image from "next/image";
import { Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";

interface ProductTableProps {
    products: any[];
    categories: { id: string; name: string }[];
    selectedProducts: string[];
    handleSelectProduct: (id: string, checked: boolean) => void;
    handleSelectAll: (checked: boolean) => void;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
}

const ProductTable = ({
    products,
    categories,
    selectedProducts,
    handleSelectProduct,
    handleSelectAll,
    handleEdit,
    handleDelete
}: ProductTableProps) => {
    if (products.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500">No products found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <th className="px-4 py-3 w-10">
                            <Checkbox
                                checked={
                                    products.length > 0 &&
                                    selectedProducts.length === products.length
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
                    {products.map((product) => (
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
                                ₮{product.price.toLocaleString()}
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
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {product.createdAt ? formatDistanceToNow(new Date(product.createdAt), { addSuffix: true }) : "Unknown"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable; 