export type Product = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  description: string;
  image: string;
  images?: string[];
  rating: number;
  categoryId?: string;
  categoryName?: string;
};

export type SimilarProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
};

// Use NextJS compatible type for page props
export type ProductDetailProps = {
  params: {
    id: string;
  };
}; 