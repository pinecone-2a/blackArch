"use client";

import Image from "next/image";
import { Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Define a constant for colors
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

interface ProductGridProps {
    products: any[];
    categories: { id: string; name: string }[];
    selectedProducts: string[];
    handleSelectProduct: (id: string, checked: boolean) => void;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
}

const ProductGrid = ({
    products,
    categories,
    selectedProducts,
    handleSelectProduct,
    handleEdit,
    handleDelete
}: ProductGridProps) => {
    if (products.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500">No products found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
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
                            <Badge variant="outline" className="bg-gray-100 font-semibold">
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
                                        backgroundColor: colors.find(c => c.value === col)?.hex || col 
                                    }}
                                    title={colors.find(c => c.value === col)?.name || col}
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
            ))}
        </div>
    );
};

export default ProductGrid; 