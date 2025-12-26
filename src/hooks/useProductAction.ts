import { useState, useEffect, useRef, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { getLocalizedValue } from "@/utils";

interface UseProductActionProps {
  product: any;
  attributes?: any[];
  globalSetting?: any;
}

export const useProductAction = ({
  product,
  attributes = [],
  globalSetting,
}: UseProductActionProps) => {
  const { addItem } = useCart();

  // States
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState<any>({});
  const [selectVa, setSelectVa] = useState<any>({});
  const [variants, setVariants] = useState<any[]>([]);

  // Track if initial setup is done to prevent loops
  const isInitialized = useRef(false);
  const productId = product?._id;

  const currency = globalSetting?.default_currency || "$";

  const getNumber = (value: any): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Compute variant titles - use useMemo to derive from attributes
  const variantTitle = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];
    if (!attributes || attributes.length === 0) return [];

    const variantKeys = Object.keys(Object.assign({}, ...product.variants));
    const matchingAttributes = attributes.filter((att: any) =>
      variantKeys.includes(att?._id)
    );

    return [...matchingAttributes].sort((a, b) => (a._id > b._id ? 1 : -1));
  }, [attributes, product?.variants]);

  // Initialize product data when product changes
  useEffect(() => {
    if (!product) return;

    // Reset initialized flag when product changes
    isInitialized.current = false;

    if (product?.variants?.length > 0) {
      // Initialize with first variant
      const firstVariant = product.variants[0];
      setVariants(product.variants);
      setStock(firstVariant?.quantity ?? 0);
      setSelectVariant(firstVariant);
      setSelectVa(firstVariant);
      setSelectedImage(firstVariant?.image || product?.image?.[0]);
      const priceValue = getNumber(firstVariant?.price);
      const originalPriceValue = getNumber(firstVariant?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPriceValue - priceValue) / originalPriceValue) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(priceValue);
      setOriginalPrice(originalPriceValue);
    } else {
      // No variants - use product base values
      setVariants([]);
      setStock(product?.stock ?? 0);
      setSelectedImage(product?.image?.[0] || "");
      const priceValue = getNumber(product?.prices?.price);
      const originalPriceValue = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPriceValue - priceValue) / originalPriceValue) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(priceValue);
      setOriginalPrice(originalPriceValue);
    }

    isInitialized.current = true;
  }, [productId]); // Only re-run when product ID changes

  // Handle variant selection changes (when user selects a variant)
  useEffect(() => {
    if (!product || !value || !isInitialized.current) return;

    const result = product?.variants?.filter((variant: any) =>
      Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
    );

    if (!result || result.length === 0) {
      setStock(0);
      return;
    }

    const res = result.map(
      ({
        originalPrice,
        price,
        discount,
        quantity,
        barcode,
        sku,
        productId,
        image,
        ...rest
      }: any) => ({
        ...rest,
      })
    );

    const filterKey = Object.keys(Object.assign({}, ...res));
    const selectVar = filterKey.reduce(
      (obj: any, key: string) => ({ ...obj, [key]: selectVariant[key] }),
      {}
    );
    const newObj = Object.entries(selectVar).reduce(
      (a: any, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );

    const result2 = result.find((v: any) =>
      Object.keys(newObj).every((k) => newObj[k] === v[k])
    );

    if (!result2) {
      setStock(0);
      return;
    }

    setVariants(result);
    setSelectVariant(result2);
    setSelectVa(result2);
    setSelectedImage(result2?.image || product?.image?.[0]);
    setStock(result2?.quantity ?? 0);
    const priceValue = getNumber(result2?.price);
    const originalPriceValue = getNumber(result2?.originalPrice);
    const discountPercentage = getNumber(
      ((originalPriceValue - priceValue) / originalPriceValue) * 100
    );
    setDiscount(getNumber(discountPercentage));
    setPrice(priceValue);
    setOriginalPrice(originalPriceValue);
  }, [value]); // Only re-run when user selects a new value

  // Add to cart
  const handleAddToCart = (quantity: number = 1) => {
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product?.variants?.length > 0 && stock <= 0) {
      return { success: false, message: "Insufficient stock" };
    }

    if (
      product?.stock <= 0 &&
      (!product?.variants || product?.variants?.length === 0)
    ) {
      return { success: false, message: "Insufficient stock" };
    }

    const selectedVariantName = variantTitle
      ?.map((att: any) =>
        att?.variants?.find((v: any) => v._id === selectVariant[att._id])
      )
      .map((el: any) => getLocalizedValue(el?.name));

    if (
      product?.variants?.length > 0 &&
      product?.variants.some(
        (variant: any) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      addItem({
        product,
        quantity,
        variantLabel: selectedVariantName.join(", "),
        priceOverride: price,
        image: selectedImage,
      });
      return { success: true, message: "Added to cart" };
    } else if (!product?.variants || product?.variants?.length === 0) {
      addItem({
        product,
        quantity,
        priceOverride: getNumber(product.prices.price),
        image: product.image[0],
      });
      return { success: true, message: "Added to cart" };
    } else {
      return { success: false, message: "Please select all variant first!" };
    }
  };

  return {
    // state
    value,
    setValue,
    price,
    stock,
    discount,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    variantTitle,
    variants,
    currency,

    // actions
    handleAddToCart,
  };
};
