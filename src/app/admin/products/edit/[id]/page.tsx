"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import ProductImageUploader from '@/app/_components/admin/ProductImageUploader';

interface EditProductProps {
  params: {
    id: string;
  };
}

export default function EditProduct({ params }: EditProductProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${params.id}`);
        setProduct(response.data);
        
        // Initialize images array with the main image and any additional images
        const productImages = [response.data.image];
        if (response.data.images && response.data.images.length > 0) {
          productImages.push(...response.data.images);
        }
        setImages(productImages);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('At least one product image is required.');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries());
      
      // Update the product with the new data and images
      await axios.put(`/api/products/${params.id}`, {
        ...formJson,
        price: parseInt(formJson.price as string),
        rating: parseInt(formJson.rating as string),
        image: images[0], // First image as the main image
        images: images.slice(1), // Rest of the images as additional images
        color: product.color, // Keep existing values for these arrays
        size: product.size
      });
      
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push('/admin/products')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button 
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={product.name}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (₮)</label>
            <input 
              type="number" 
              name="price" 
              defaultValue={product.price}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={product.description || ''}
              rows={4}
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category ID</label>
            <input 
              type="text" 
              name="categoryId" 
              defaultValue={product.categoryId || ''}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
            <input 
              type="number" 
              name="rating" 
              defaultValue={product.rating || 5}
              min="1"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <ProductImageUploader 
              initialImages={images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center"
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 