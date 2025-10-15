import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { fetchProductBySlug, fetchStoreProducts } from "@/services/products";
import { ProductQueryParams } from "@/services/products";
import { Product, ProductListingResponse } from "@/types";

export const useProducts = (params: ProductQueryParams = {}) =>
  useQuery<ProductListingResponse>({
    queryKey: [QUERY_KEYS.products, params],
    queryFn: () => fetchStoreProducts(params),
    staleTime: 1000 * 60
  });

export const useProduct = (slug?: string) =>
  useQuery<Product>({
    queryKey: [QUERY_KEYS.product, slug],
    queryFn: () => {
      if (!slug) throw new Error("Product slug is required");
      return fetchProductBySlug(slug);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5
  });
