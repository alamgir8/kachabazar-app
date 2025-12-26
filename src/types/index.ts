export type LocalizedField = Record<string, string>;

export interface Category {
  _id: string;
  name: LocalizedField | string;
  slug?: string;
  icon?: string;
  parentId?: string;
  description?: LocalizedField | string;
  status?: string;
  children?: Category[];
}

export interface Price {
  originalPrice: number;
  price: number;
  discount?: number;
}

export interface VariantOption {
  name: string;
  options: Array<{
    label: string;
    price?: number;
    discount?: number;
    stock?: number;
    image?: string;
    [key: string]: unknown;
  }>;
}

export interface Product {
  _id: string;
  productId?: string;
  sku?: string;
  barcode?: string;
  title: LocalizedField;
  description?: LocalizedField;
  slug: string;
  categories: string[];
  category?: Category | string;
  image: string[];
  stock?: number;
  sales?: number;
  tag?: any;
  prices: Price;
  variants?: VariantOption[];
  isCombination: boolean;
  average_rating?: number;
  total_reviews?: number;
  status?: "show" | "hide";
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  rating: number;
  review: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

export interface StoreCustomization {
  home?: Record<string, unknown>;
  navbar?: Record<string, unknown>;
  footer?: Record<string, unknown>;
  checkout?: Record<string, unknown>;
  slug?: Record<string, unknown>;
  offers?: Record<string, unknown>;
}

export interface StoreSetting {
  currency?: string;
  default_currency?: string;
  company_name?: string;
  address?: string;
  contact?: string;
  email?: string;
  vat_number?: string;
  website?: string;
  logo?: string;
  favicon?: string;
  orderPrefix?: string;
  [key: string]: unknown;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  country?: string;
  city?: string;
  shippingAddress?: ShippingAddress | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  name?: string;
  contact?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  [key: string]: unknown;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  variant?: string;
  product: Product;
  subtotal: number;
}

export interface OrderSummary {
  _id: string;
  invoice?: number;
  cart: CartItem[];
  user_info: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  subTotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingOption?: string;
  paymentMethod: string;
  status: "pending" | "processing" | "delivered" | "cancel";
  coupon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalDoc: number;
  limits: number;
  pages: number;
}

export interface ProductListingResponse {
  products: Product[];
  relatedProducts: Product[];
  popularProducts: Product[];
  discountedProducts: Product[];
  reviews: Review[];
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}
