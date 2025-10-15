import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { fetchCategories } from "@/services/categories";
import { Category } from "@/types";

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10
  });
