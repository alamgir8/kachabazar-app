import { http } from "./http";

export interface Attribute {
  _id: string;
  title: Record<string, string>;
  name: Record<string, string>;
  variants: {
    _id: string;
    name: Record<string, string>;
    status: "show" | "hide";
  }[];
  option: "dropdown" | "radio" | "checkbox";
  type: "attribute" | "extra";
  status: "show" | "hide";
}

export const attributeService = {
  getAll: async (): Promise<Attribute[]> => {
    const response = await http.get<{ attributes: Attribute[] }>(
      "/attributes/show"
    );
    return response.attributes || [];
  },

  getById: async (id: string): Promise<Attribute> => {
    const response = await http.get<Attribute>(`/attributes/${id}`);
    return response;
  },
};
