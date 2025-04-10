export type QPayUrl = {
  data?: {
    qr_image?: string;
    qr_text?: string;
    urls?: any[];
    invoice_id?: string;
    [key: string]: any;
  };
  urls?: any[];
  response?: {
    data?: {
      urls?: any[];
      [key: string]: any;
    };
  };
  [key: string]: any;
}

export type OrderDetails = {
  id?: string;
  totalPrice?: number;
  paymentMethod?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  qpayUrl?: QPayUrl;
  shippingAddress?: {
    city: string;
    street: string;
    postalCode?: string;
    zip?: string;
    [key: string]: any;
  };
  productDetails?: Array<{
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
    [key: string]: any;
  }>;
  customerName?: string;
  customerEmail?: string;
  customerInfo?: {
    name: string;
    email: string;
  };
  [key: string]: any;
} 