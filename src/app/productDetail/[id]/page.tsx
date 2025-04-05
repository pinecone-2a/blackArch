"use client"
import React, { useState, useEffect } from 'react';
import Footer from '@/app/_components/homeFooter';
import Header from '@/app/_components/homeHeader';
import axios from 'axios';
import { use } from "react";
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";
import { toast, Toaster } from 'sonner';
import { 
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';
import { LookingSimilar } from 'react-instantsearch';
import { FC } from 'react';
import { 
    Check, ShoppingCart, Heart, Share2, Star, 
    StarHalf, ChevronRight, ArrowLeft, ArrowRight,
    ShieldCheck, Truck, RefreshCcw, Minus, Plus 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductDetailProps = {
    params: Promise<{ id: string }>;
}

type Product = {
    id: string,
    name: string,
    price: number,
    discount: number,
    rating: number,
    image: string,
    colors: string[],
    sizes: string[],
    description: string,
    categoryId?: string,
    categoryName?: string
}

type SimilarProduct = {
    id: string,
    name: string,
    price: number,
    rating: number,
    image: string
}

// Sample product images for gallery (in a real app, these would come from the API)
const sampleProductImages = [
    '/street.jpg',
    '/street2.jpg',
    '/zurag2.jpeg',
    '/zurag3.jpeg',
    '/zurag4.jpeg'
];

// Sample similar products
const sampleSimilarProducts: SimilarProduct[] = [
    {
        id: '1',
        name: 'Casual Black T-Shirt',
        price: 25000,
        rating: 4.2,
        image: '/casual.png'
    },
    {
        id: '2',
        name: 'Street Style Jacket',
        price: 45000,
        rating: 4.7,
        image: '/street.jpg'
    },
    {
        id: '3',
        name: 'Urban Hoodie',
        price: 35000,
        rating: 4.5,
        image: '/podolk.png'
    },
    {
        id: '4',
        name: 'Premium Streetwear',
        price: 55000,
        rating: 4.8,
        image: '/street2.jpg'
    },
    {
        id: '5',
        name: 'Casual Cap',
        price: 15000,
        rating: 4.3,
        image: '/podolk.png'
    }
];

const ProductDetail: FC<ProductDetailProps> = ({ params }) => {
    const { id } = use(params);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedTab, setSelectedTab] = useState('description');
    const [isWishlist, setIsWishlist] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Animation states
    const [ripple, setRipple] = useState(false);
    const [shake, setShake] = useState(false);

    // Handle button click animations
    const handleAddToCartClick = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select size and color");
            return;
        }
        
        setRipple(true);
        setShake(true);
        addToCart();

        setTimeout(() => setRipple(false), 600);
        setTimeout(() => setShake(false), 300);
    };

    // Handle color selection
    const handleColorClick = (color: string) => {
        setSelectedColor(color);
    };

    // Handle size selection
    const handleSizeClick = (size: string) => {
        setSelectedSize(size);
    };

    // Handle quantity changes
    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity(quantity + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Toggle wishlist
    const toggleWishlist = () => {
        setIsWishlist(!isWishlist);
        if (!isWishlist) {
            toast.success("Added to wishlist");
        } else {
            toast("Removed from wishlist");
        }
    };

    // Handle image gallery navigation
    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);
        setMainImage(index === 0 ? (product?.image || '') : sampleProductImages[index - 1]);
    };

    const nextImage = () => {
        const maxIndex = sampleProductImages.length;
        const nextIndex = currentImageIndex === maxIndex ? 0 : currentImageIndex + 1;
        handleImageChange(nextIndex);
    };

    const prevImage = () => {
        const maxIndex = sampleProductImages.length;
        const prevIndex = currentImageIndex === 0 ? maxIndex : currentImageIndex - 1;
        handleImageChange(prevIndex);
    };

    // Star rating component
    const RatingStars = ({ rating }: { rating: number }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-500" />
                ))}
            </div>
        );
    };

    // Fetch product data
    useEffect(() => {
        setIsLoading(true);
        axios.get(`/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setMainImage(response.data.image);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setIsLoading(false);
            });

        // Check if mobile
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => window.removeEventListener('resize', checkIfMobile);
    }, [id]);

    // Add product to cart
    const addToCart = () => {
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(
            (item: any) => item.productId === product.id && 
                           item.size === selectedSize && 
                           item.color === selectedColor
        );
        
        if (existingProductIndex >= 0) {
            // Update quantity if product exists
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.push({
                productId: product.id,
                size: selectedSize,
                color: selectedColor,
                quantity: quantity,
                image: product.image,
                name: product.name,
                price: product.price,
                description: product.description
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success("Сагсанд амжилттай нэмэгдлээ!");
    };

    // Format price with spacing
    const formatPrice = (price: number) => {
        return price?.toLocaleString().replace(/,/g, ' ');
    };

    // Colors data
    const colorOptions = [
        { color: 'green', label: 'Green', bgColor: 'bg-green-700', ringColor: 'hover:ring-green-500' },
        { color: 'black', label: 'Black', bgColor: 'bg-black', ringColor: 'hover:ring-gray-500' },
        { color: 'gray', label: 'Gray', bgColor: 'bg-gray-700', ringColor: 'hover:ring-gray-400' },
        { color: 'red', label: 'Red', bgColor: 'bg-red-700', ringColor: 'hover:ring-red-500' },
        { color: 'pink', label: 'Pink', bgColor: 'bg-pink-400', ringColor: 'hover:ring-pink-500' },
        { color: 'blue', label: 'Blue', bgColor: 'bg-blue-700', ringColor: 'hover:ring-blue-500' }
    ];

    // Size options
    const sizeOptions = ['Small', 'Medium', 'Large', 'X-Large'];

    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            <Toaster position='top-center' />
            
            <main className='flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
                {/* Breadcrumb navigation */}
                <div className="mb-6 py-4">
                    <Breadcrumb>
                        <BreadcrumbList className='text-sm sm:text-base flex items-center'>
                            <BreadcrumbItem>
                                <BreadcrumbLink className='hover:underline text-gray-600' href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink className='hover:underline text-gray-600' href="/category">Shop</BreadcrumbLink>
                            </BreadcrumbItem>
                            {product?.categoryName && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink 
                                            className='hover:underline text-gray-600' 
                                            href={`/category?cat=${product.categoryId}`}
                                        >
                                            {product.categoryName}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className='text-black font-medium'>
                                    {isLoading ? (
                                        <Skeleton className="h-5 w-20" />
                                    ) : product?.name || 'Product'}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Product details grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
                    {/* Product images */}
                    <div className="space-y-6">
                        {/* Main product image */}
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square">
                            {isLoading ? (
                                <Skeleton className="absolute inset-0" />
                            ) : (
                                <>
                                    <img 
                                        src={mainImage} 
                                        alt={product?.name || 'Product'}
                                        className='w-full h-full object-cover transition-all duration-500 hover:scale-105' 
                                    />
                                    
                                    {/* Image navigation arrows */}
                                    <div className="absolute inset-0 flex items-center justify-between p-4">
                                        <button 
                                            onClick={prevImage}
                                            className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                                            aria-label="Previous image"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                                            aria-label="Next image"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Wishlist button */}
                                    <button 
                                        onClick={toggleWishlist}
                                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart 
                                            className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Thumbnail gallery */}
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {isLoading ? (
                                Array(5).fill(0).map((_, index) => (
                                    <Skeleton key={index} className="w-20 h-20 rounded-md flex-shrink-0" />
                                ))
                            ) : (
                                <>
                                    <button 
                                        onClick={() => handleImageChange(0)}
                                        className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === 0 ? 'border-black' : 'border-transparent'}`}
                                    >
                                        <img 
                                            src={product?.image} 
                                            alt={product?.name || 'Product'} 
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                    
                                    {sampleProductImages.map((image, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => handleImageChange(index + 1)}
                                            className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === index + 1 ? 'border-black' : 'border-transparent'}`}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${product?.name || 'Product'} view ${index + 1}`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product details */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-10 w-4/5" />
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-12 w-32" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-6 w-40" />
                                <div className="flex gap-2">
                                    {Array(6).fill(0).map((_, index) => (
                                        <Skeleton key={index} className="w-10 h-10 rounded-full" />
                                    ))}
                                </div>
                                <Skeleton className="h-6 w-36" />
                                <div className="flex gap-4">
                                    {Array(4).fill(0).map((_, index) => (
                                        <Skeleton key={index} className="w-24 h-10 rounded-lg" />
                                    ))}
                                </div>
                                <div className="flex space-x-4">
                                    <Skeleton className="h-12 w-32" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Product name */}
                                <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-gray-900'>
                                    {product?.name}
                                </h1>
                                
                                {/* Ratings */}
                                <div className='flex items-center'>
                                    <div className="flex items-center">
                                        <RatingStars rating={product?.rating || 4.5} />
                                        <span className='ml-2 text-sm text-gray-500'>
                                            {product?.rating || 4.5}/5 (24 reviews)
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Price */}
                                <div className='flex items-center space-x-4'>
                                    <span className='text-2xl sm:text-3xl font-bold text-gray-900'>
                                        {product?.price ? `${formatPrice(product.price)}₮` : ''}
                                    </span>
                                    
                                    {product?.discount && product.discount > 0 && (
                                        <>
                                            <span className='text-lg sm:text-xl text-gray-500 line-through'>
                                                {formatPrice(product.price * (1 + product.discount / 100))}₮
                                            </span>
                                            <span className='text-sm px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium'>
                                                {product.discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Product description */}
                                <Tabs defaultValue="description" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                                    <TabsList className="grid grid-cols-3 mb-4">
                                        <TabsTrigger value="description">Description</TabsTrigger>
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="description" className="pt-2">
                                        <p className='text-gray-700'>
                                            {product?.description}
                                        </p>
                                    </TabsContent>
                                    
                                    <TabsContent value="details" className="pt-2">
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Premium quality material</li>
                                            <li>• Comfortable fit</li>
                                            <li>• Machine washable</li>
                                            <li>• 100% authentic</li>
                                            <li>• Designed in Mongolia</li>
                                        </ul>
                                    </TabsContent>
                                    
                                    <TabsContent value="shipping" className="pt-2">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <Truck className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Free shipping on orders over 50,000₮</span>
                                            </li>
                                            <li className="flex items-start">
                                                <ShieldCheck className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Secure payment options</span>
                                            </li>
                                            <li className="flex items-start">
                                                <RefreshCcw className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">30 days return policy</span>
                                            </li>
                                        </ul>
                                    </TabsContent>
                                </Tabs>
                                
                                {/* Color selection */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className='text-sm font-medium text-gray-900'>
                                            Color: <span className="capitalize">{selectedColor || 'Select a color'}</span>
                                        </label>
                                        {!selectedColor && (
                                            <span className="text-xs text-red-500">Required</span>
                                        )}
                                    </div>
                                    
                                    <div className='flex flex-wrap gap-3'>
                                        {colorOptions.map(({ color, label, bgColor, ringColor }) => (
                                            <button
                                                key={color}
                                                aria-label={`Select ${label} color`}
                                                className={`relative w-10 h-10 rounded-full ${bgColor} hover:ring-4 transition duration-300 flex items-center justify-center
                                                    ${selectedColor === color ? 'ring-4 ring-black/30' : ''} ${ringColor}`}
                                                onClick={() => handleColorClick(color)}
                                            >
                                                {selectedColor === color && (
                                                    <Check className="text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Size selection */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className='text-sm font-medium text-gray-900'>
                                            Size: <span>{selectedSize || 'Select a size'}</span>
                                        </label>
                                        {!selectedSize && (
                                            <span className="text-xs text-red-500">Required</span>
                                        )}
                                        <button className="text-xs text-blue-600 underline">Size guide</button>
                                    </div>
                                    
                                    <div className='flex flex-wrap gap-3'>
                                        {sizeOptions.map((size) => (
                                            <button
                                                key={size}
                                                className={`px-4 py-2 border rounded-lg transition-all duration-300 ease-out
                                                hover:bg-gray-100
                                                ${selectedSize === size 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'border-gray-300 text-gray-700'}`}
                                                onClick={() => handleSizeClick(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Quantity selector and add to cart */}
                                <div className='flex flex-wrap gap-4 items-center pt-4'>
                                    <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
                                        <button
                                            className='px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors'
                                            onClick={() => handleQuantityChange('decrease')}
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        
                                        <span className='w-12 text-center font-medium'>{quantity}</span>
                                        
                                        <button
                                            className='px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors'
                                            onClick={() => handleQuantityChange('increase')}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <Button
                                        className={`relative flex-1 gap-2 py-6 font-medium bg-black text-white hover:bg-gray-800 shadow-lg
                                        transition-all duration-300 ${shake ? 'animate-shake' : ''}`}
                                        onClick={handleAddToCartClick}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                        {ripple && (
                                            <span className="absolute inset-0 flex items-center justify-center">
                                                <span className="w-20 h-20 bg-white opacity-30 rounded-full animate-ping"></span>
                                            </span>
                                        )}
                                    </Button>
                                    
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="p-2.5" 
                                        onClick={() => toast.info("Shared product link")}
                                        aria-label="Share product"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                
                                {/* Product tags */}
                                <div className="pt-4">
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">Streetwear</span>
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">Casual</span>
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">Fashion</span>
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">Urban</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Similar products section */}
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className='text-2xl font-bold text-gray-900'>You Might Also Like</h2>
                        <Button variant="ghost" className="gap-1" asChild>
                            <Link href="/category">
                                View all <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="flex flex-col space-y-2">
                                    <Skeleton className="aspect-square rounded-lg" />
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            ))
                        ) : (
                            sampleSimilarProducts.map((product) => (
                                <Link 
                                    key={product.id}
                                    href={`/productDetail/${product.id}`}
                                    className="group flex flex-col"
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-medium text-gray-900 group-hover:underline line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        <RatingStars rating={product.rating} />
                                        <span className="text-xs text-gray-500 ml-1">
                                            {product.rating}
                                        </span>
                                    </div>
                                    <p className="font-semibold mt-1">
                                        {formatPrice(product.price)}₮
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}

export default ProductDetail;