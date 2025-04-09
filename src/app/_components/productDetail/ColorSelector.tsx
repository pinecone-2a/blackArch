"use client"
import React from 'react';
import { Check } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

type ColorOption = {
    color: string;
    bgColor: string;
    ringColor: string;
};

type ColorSelectorProps = {
    isLoading: boolean;
    selectedColor: string;
    onColorSelect: (color: string) => void;
    colorOptions?: ColorOption[];
};

const DEFAULT_COLORS: ColorOption[] = [
    { color: 'green', bgColor: 'bg-green-700', ringColor: 'hover:ring-green-500' },
    { color: 'black', bgColor: 'bg-black', ringColor: 'hover:ring-gray-500' },
    { color: 'gray', bgColor: 'bg-gray-700', ringColor: 'hover:ring-gray-400' },
    { color: 'red', bgColor: 'bg-red-700', ringColor: 'hover:ring-red-500' },
    { color: 'pink', bgColor: 'bg-pink-400', ringColor: 'hover:ring-pink-500' },
    { color: 'blue', bgColor: 'bg-blue-700', ringColor: 'hover:ring-blue-500' }
];

const ColorSelector: React.FC<ColorSelectorProps> = ({ 
    isLoading, 
    selectedColor, 
    onColorSelect,
    colorOptions = DEFAULT_COLORS
}) => {
    return (
        <div>
            <p className='text-lg font-bold mt-18'>Өнгө</p>
            
            {isLoading ? (
                <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="w-10 h-10 rounded-full" />
                    ))}
                </div>
            ) : (
                <div className='flex gap-2 mt-2'>
                    {colorOptions.map(({ color, bgColor, ringColor }) => (
                        <button
                            key={color}
                            className={`relative w-10 h-10 rounded-full ${bgColor} ${ringColor} hover:ring-4 transition duration-300 flex items-center justify-center cursor-grab`}
                            onClick={() => onColorSelect(color)}
                            title={`${color.charAt(0).toUpperCase()}${color.slice(1)}`}
                        >
                            {selectedColor === color && (
                                <Check className="text-white" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColorSelector; 