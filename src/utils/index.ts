import { LocalizedField, Product } from "@/types";

export const getLocalizedValue = (
  value?: LocalizedField | string,
  locale: string = "en"
): string => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return (
    value[locale] ??
    value["en"] ??
    value[Object.keys(value)[0] as keyof typeof value] ??
    ""
  );
};

export const formatCurrency = (
  value: number,
  currency: string = "$",
  fractionDigits = 2
): string =>
  `${currency}${Number.isFinite(value) ? value.toFixed(fractionDigits) : "0.00"}`;

export const getProductImage = (product?: Product): string => {
  if (!product?.image?.length) return "";
  if (typeof product.image[0] === "string") return product.image[0];
  return "";
};

export const calculateDiscountPercentage = (
  originalPrice?: number,
  salePrice?: number
): number => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }

  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
