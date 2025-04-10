"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Define Category type
type Category = {
  id: string;
  name: string;
  description?: string;
  products?: any[];
};

// Helper function for API URLs to handle both development and production
const getApiUrl = (path: string): string => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            // Use environment variable in local development
            return `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
        } else {
            // In production, use absolute URL to API
            const origin = window.location.origin;
            return `${origin}/api/${path.replace(/^\//, '')}`;
        }
    } else {
        // Server-side rendering - use the environment variable
        return `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
    }
};

export default function AdminCategoryComp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Always use absolute URL with origin
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/api/category`;
      console.log("Fetching categories from:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("Categories response:", data);
      
      if (data.message && Array.isArray(data.message)) {
        setCategories(data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding/editing category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Always use absolute URL with origin
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      let url;
      
      if (editMode && editCategoryId) {
        // Update existing category
        url = `${origin}/api/category/${editCategoryId}`;
        console.log("Updating category at:", url);
        
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Category updated successfully");
          fetchCategories();
        } else {
          throw new Error("Failed to update category");
        }
      } else {
        // Create new category
        url = `${origin}/api/category`;
        console.log("Creating category at:", url);
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Category added successfully");
          fetchCategories();
        } else {
          throw new Error("Failed to add category");
        }
      }
      // Reset form and close dialog
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(editMode ? "Failed to update category" : "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle editing a category
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditMode(true);
    setEditCategoryId(category.id);
    setDialogOpen(true);
  };

  // Handle deleting a category
  const handleDelete = async (id: string) => {
    try {
      // Always use absolute URL with origin
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/api/category/${id}`;
      console.log("Deleting category at:", url);
      
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  // Reset form data and edit mode
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditMode(false);
    setEditCategoryId(null);
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Төрөл</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2"
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />Нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? "Update the category details below." 
                  : "Create a new category for your products."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Нэр*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Тайлбар (заавал биш)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                resetForm();
                setDialogOpen(false);
              }}>
                Буцах
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editMode ? "Шинэчлэх" : "Add Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="grid gap-6">
        {loading ? (
          <Card>
            <CardContent className="p-6 flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </CardContent>
          </Card>
        ) : categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        {category.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setConfirmDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {category.products?.length || 0} products
                        </span>
                        <Link href={`/admin/products?category=${category.id}`}>
                          <Button variant="link" size="sm" className="h-8 px-2">
                            Бүтээгдэхүүнүүд харах
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* Delete Confirmation */}
                  {confirmDeleteId === category.id && (
                    <div className="p-4 bg-red-50 border-t border-red-100 flex justify-between items-center">
                      <p className="text-sm text-red-700">
                        Устгахдаа итгэлтэй байна уу?
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">Олдсонгүй</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Нэмэх
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}