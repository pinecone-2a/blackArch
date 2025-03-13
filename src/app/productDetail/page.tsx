import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '../_components/homeFooter';

export default function ProductDetail() {
    return (
        <div className='p-4 max-w-7xl mx-auto'>

            <div className='flex items-center text-gray-500 text-2xl'>
                Home <ChevronRight size={16} /> Shop <ChevronRight size={16} /> Men <ChevronRight size={16} />
                <span className='text-black'>T-Shirts</span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6'>

                <div>
                    <div className='bg-gray-300 rounded-2xl p-2'>
                        <img src='t-shirt.png' alt='Product' className='w-full rounded-xl' />
                    </div>
                    <div className='flex gap-3 mt-4'>
                        <img src='t-shirt.png' className='w-24 h-24 bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-24 h-24 bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-24 h-24 bg-gray-300 rounded-xl p-1' />
                    </div>
                </div>


                <div>
                    <h1 className='text-5xl font-bold'>ONE LIFE GRAPHIC T-SHIRT</h1>
                    <div className='flex items-center mt-2 text-3xl'>
                        <span className='text-yellow-500'>★★★★☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>4.5/5</span>
                    </div>
                    <div className='flex items-center gap-2 mt-3 text-4xl'>
                        <h2 className='font-bold'>$260</h2>
                        <h2 className='text-gray-400 line-through'>$300</h2>
                        <h2 className='text-red-500 font-semibold'>-40%</h2>
                    </div>
                    <p className='mt-3 text-gray-700 text-xl'>
                        This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric,
                        it offers superior comfort and style.
                    </p>

                    <p className='text-lg font-bold mt-4 text-end'>Select Colors</p>
                    <div className='flex gap-2 mt-2'>
                        <button className='w-10 h-10 rounded-full bg-green-700'></button>
                        <button className='w-10 h-10 rounded-full bg-black'></button>
                        <button className='w-10 h-10 rounded-full bg-gray-700'></button>
                        <button className='w-10 h-10 rounded-full bg-red-700'></button>
                        <button className='w-10 h-10 rounded-full bg-pink-400'></button>
                        <button className='w-10 h-10 rounded-full bg-blue-700'></button>

                    </div>

                    <p className='text-lg font-bold mt-4 text-end'>Choose Size</p>
                    <div className='flex gap-5 mt-2 rounded-full '>
                        <button className='px-4 py-2 border rounded-lg'>Small</button>
                        <button className='px-4 py-2 border rounded-lg'>Medium</button>
                        <button className='px-4 py-2 border rounded-lg bg-black text-white'>Large</button>
                        <button className='px-4 py-2 border rounded-lg'>X-Large</button>
                    </div>

                    <div className='flex items-center gap-4 mt-6'>
                        <button className='px-4 py-2 bg-gray-200 rounded-lg'>-</button>
                        <span className='text-lg font-semibold'>1</span>
                        <button className='px-4 py-2 bg-gray-200 rounded-lg'>+</button>
                        <Button className='bg-black text-white p-3 rounded-full ml-auto'>Add to Cart</Button>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl font-bold text-center mt-10'>YOU MIGHT ALSO LIKE</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-6'>
                <div className='bg-gray-100 p-4 rounded-lg'>
                    <img src='t-shirt.png' className='w-full rounded-lg' />
                    <h3 className='text-lg font-semibold mt-4'>Polo with Contrast Trims</h3>
                    <div className='flex items-center mt-2'>
                        <span className='text-yellow-500'>★★★★☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>4.0/5</span>
                    </div>
                    <div className='flex items-center mt-2'>
                        <span className='text-xl font-bold'>$212</span>
                        <span className='ml-2 line-through text-gray-400'>$242</span>
                        <span className='ml-2 text-red-500'>-20%</span>
                    </div>
                </div>
                <div className='bg-gray-100 p-4 rounded-lg'>
                    <img src='t-shirt.png' className='w-full rounded-lg' />
                    <h3 className='text-lg font-semibold mt-4'>Gradient Graphic T-shirt</h3>
                    <div className='flex items-center mt-2'>
                        <span className='text-yellow-500'>★★★☆☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>3.5/5</span>
                    </div>
                    <div className='mt-2 text-xl font-bold'>$145</div>
                </div>
            </div>
            <div className='pt-10'>
                <Footer />
            </div>
        </div>
    );
}
