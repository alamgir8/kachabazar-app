import { DEFAULT_PAGE_SIZE } from "@/constants";
import { http } from "@/services/http";
import { Product, ProductListingResponse } from "@/types";

export interface ProductQueryParams {
  category?: string;
  title?: string;
  slug?: string;
  limit?: number;
  page?: number;
}

const buildQuery = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

export const fetchStoreProducts = (params: ProductQueryParams = {}) => {
  const search = buildQuery(params);
  const endpoint = search
    ? `/products/store?${search}`
    : "/products/store";

  return http.get<ProductListingResponse>(endpoint);
};

export const fetchProductBySlug = (slug: string) =>
  http.get<Product>(`/products/product/${slug}`);

export const fetchAllProducts = (params: {
  title?: string;
  category?: string;
  price?: string;
  page?: number;
  limit?: number;
} = {}) => {
  const query = buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_PAGE_SIZE,
    ...params
  });

  return http.get<{
    products: Product[];
    totalDoc: number;
    limits: number;
    pages: number;
  }>(`/products?${query}`);
};
