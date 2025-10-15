import { useQuery } from "@tanstack/react-query";
import { attributeService, type Attribute } from "@/services/attributes";

export const useAttributes = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: attributeService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAttribute = (id: string) => {
  return useQuery({
    queryKey: ["attribute", id],
    queryFn: () => attributeService.getById(id),
    enabled: !!id,
  });
};
