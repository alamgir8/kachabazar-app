import { http } from "./http";

// Product Types
export interface Product {
  _id: string;
  productId?: string;
  sku?: string;
  barcode?: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  slug: string;
  categories: string[];
  category: string;
  image: string[];
  stock?: number;
  sales?: number;
  tag: string[];
  prices: {
    originalPrice: number;
    price: number;
    discount?: number;
  };
  variants?: any[];
  isCombination: boolean;
  average_rating: number;
  total_reviews: number;
  status: "show" | "hide";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
  popularProducts?: Product[];
  discountedProducts?: Product[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

// Get all products with filters and pagination
export const getProducts = (query?: ProductQuery, token?: string) => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  return http.get<ProductsResponse>(`/products/store?${params.toString()}`, {
    token: token || undefined,
  });
};

// Get showing products only
export const getShowingProducts = (token?: string) =>
  http.get<ProductsResponse>("/products/show", { token: token || undefined });

// Get product by ID
export const getProductById = (id: string, token?: string) =>
  http.post<Product>(`/products/${id}`, undefined, {
    token: token || undefined,
  });

// Get product by slug
export const getProductBySlug = (slug: string, token?: string) =>
  http.get<Product>(`/products/product/${slug}`, { token: token || undefined });

// Search products
export const searchProducts = (
  searchTerm: string,
  page = 1,
  limit = 20,
  token?: string
) => {
  return http.get<ProductsResponse>(
    `/products/store?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
    { token: token || undefined }
  );
};

// Get products by category
export const getProductsByCategory = (
  categoryId: string,
  page = 1,
  limit = 20,
  token?: string
) => {
  return http.get<ProductsResponse>(
    `/products/store?category=${categoryId}&page=${page}&limit=${limit}`,
    { token: token || undefined }
  );
};

// Get popular products
export const getPopularProducts = (limit = 10, token?: string) =>
  http.get<ProductsResponse>(`/products/store?sort=popular&limit=${limit}`, {
    token: token || undefined,
  });

// Get discounted products
export const getDiscountedProducts = (limit = 10, token?: string) =>
  http.get<ProductsResponse>(`/products/store?sort=discount&limit=${limit}`, {
    token: token || undefined,
  });

// Get related products
export const getRelatedProducts = (
  productId: string,
  categoryId: string,
  limit = 6,
  token?: string
) =>
  http.get<ProductsResponse>(
    `/products/store?category=${categoryId}&limit=${limit}&exclude=${productId}`,
    { token: token || undefined }
  );
