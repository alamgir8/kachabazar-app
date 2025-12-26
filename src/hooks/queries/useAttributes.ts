import { useQuery } from "@tanstack/react-query";
import { attributeService, type Attribute } from "@/services/attributes";

interface UseAttributesOptions {
  enabled?: boolean;
}

export const useAttributes = (options: UseAttributesOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["attributes"],
    queryFn: attributeService.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes - attributes rarely change
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    enabled,
  });
};

export const useAttribute = (id: string) => {
  return useQuery({
    queryKey: ["attribute", id],
    queryFn: () => attributeService.getById(id),
    enabled: !!id,
  });
};
