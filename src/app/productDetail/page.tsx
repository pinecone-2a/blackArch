import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { px } from 'motion/react';
export default function ProductDetail() {
    return (
        <div className='pl-4 pr-4'>
            <div className="flex gap-1 pt-4 pl-4">
                <p className="text-gray-500 flex">
                    Home <ChevronRight />
                    Shop <ChevronRight />
                    Men <ChevronRight />
                </p>
                <div>T-Shirt</div>
            </div>

            <div>
                <div className='pt-7 pl-4 pr-4 '>
                    <img src="cloth-1.png" alt="" />
                </div>

                <div className='flex w-30 h-35 pt-3'>
                    <img src="cloth-1.png" className='rounded-2xl pl-4' />
                    <img src="cloth-1.png" className='rounded-2xl pl-4' />
                    <img src="cloth-1.png" className='rounded-2xl pl-4' />
                </div>

                <div>
                    <div className='pt-7'>
                        <h1 className='text-3xl font-bold'>ONE LIFE GRAPHIC</h1>
                        <h1 className='text-3xl font-bold'>T-SHIRT</h1>
                    </div>

                    <div className='flex gap-1 pt-3'>
                        <Star className='text-yellow-200' />
                        <Star className='text-yellow-200' />
                        <Star className='text-yellow-200' />
                        <Star className='text-yellow-200' />
                        <Star className='text-yellow-200' />
                        4/5
                    </div>

                    <div className='flex gap-2 text-xl pt-3'>
                        <h2>$260</h2>
                        <h2 className='text-gray-400'>$300</h2>
                        <h2 className='rounded-full bg-red-400'>-40%</h2>
                    </div>

                    <p className='pt-3'>This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.</p>

                    <div>
                        <p className='text-xl font-bold pt-3'>Select Colors</p>
                        <div className='flex gap-2 pt-2 '>
                            <button className='rounded-full h-10 w-10 bg-red-500'></button>
                            <button className='rounded-full h-10 w-10 bg-[#4F4631] '></button>
                            <button className='rounded-full h-10 w-10 bg-black'></button>
                            <button className='rounded-full h-10 w-10 bg-green-500 '></button>
                        </div>
                    </div>

                    <div>
                        <p className='text-xl font-bold pt-3'>Size</p>
                        <div className='flex gap-2 pt-2 justify-between'>
                            <button className='rounded-full bg-gray-300 p-3'>Small</button>
                            <button className='rounded-full bg-gray-300 p-3'>Medium</button>
                            <button className='rounded-full bg-gray-300 p-3'>Large</button>
                            <button className='rounded-full bg-gray-300 p-3'>X-Large</button>
                        </div>
                    </div>

                    <div className='flex pt-5 justify-around'>
                        <button className='rounded-full bg-gray-300 pl-10 pr-10 p-1'>
                            <p className='flex justify-between'>- 1 +</p>
                        </button>
                        <button className='rounded-full bg-black text-white p-1 pl-10 pr-10'>
                            Add to Cart
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}