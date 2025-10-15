import { http } from "@/services/http";
import { Category } from "@/types";

export const fetchCategories = () =>
  http.get<Category[]>("/category/show");
