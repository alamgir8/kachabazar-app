import { useState, useEffect } from "react";
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
  const [variantTitle, setVariantTitle] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const currency = globalSetting?.default_currency || "$";

  const getNumber = (value: any): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Handle variant & price updates
  useEffect(() => {
    // Guard against null/undefined product
    if (!product) return;

    if (value) {
      const result = product?.variants?.filter((variant: any) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      const res = result?.map(
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
      const selectVar = filterKey?.reduce(
        (obj: any, key: string) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a: any, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v: any) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setSelectedImage(result2?.image);
      setStock(result2?.quantity);
      const priceValue = getNumber(result2?.price);
      const originalPriceValue = getNumber(result2?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPriceValue - priceValue) / originalPriceValue) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(priceValue);
      setOriginalPrice(originalPriceValue);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant: any) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);
      setStock(product.variants[0]?.quantity);
      setSelectVariant(product.variants[0]);
      setSelectVa(product.variants[0]);
      setSelectedImage(product.variants[0]?.image);
      const priceValue = getNumber(product.variants[0]?.price);
      const originalPriceValue = getNumber(product.variants[0]?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPriceValue - priceValue) / originalPriceValue) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(priceValue);
      setOriginalPrice(originalPriceValue);
    } else {
      setStock(product?.stock);
      setSelectedImage(product?.image?.[0]);
      const priceValue = getNumber(product?.prices?.price);
      const originalPriceValue = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPriceValue - priceValue) / originalPriceValue) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(priceValue);
      setOriginalPrice(originalPriceValue);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product?.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  // Handle variant title mapping
  useEffect(() => {
    if (!product?.variants || !attributes) return;
    const res = Object.keys(Object.assign({}, ...product?.variants));
    const varTitle = attributes?.filter((att: any) => res.includes(att?._id));
    setVariantTitle(varTitle?.sort());
  }, [variants, attributes, product?.variants]);

  // Add to cart
  const handleAddToCart = (quantity: number = 1) => {
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product?.variants?.length === 1 && product?.variants[0].quantity < 1) {
      return { success: false, message: "Insufficient stock" };
    }
    if (stock <= 0) {
      return { success: false, message: "Insufficient stock" };
    }

    const selectedVariantName = variantTitle
      ?.map((att: any) =>
        att?.variants?.find((v: any) => v._id === selectVariant[att._id])
      )
      .map((el: any) => getLocalizedValue(el?.name));

    if (
      product?.variants.some(
        (variant: any) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const { variants, categories, description, ...updatedProduct } = product;
      const newItem = {
        ...updatedProduct,
        id:
          product?.variants.length <= 0
            ? product._id
            : product._id +
              "-" +
              variantTitle?.map((att: any) => selectVariant[att._id]).join("-"),
        title:
          product?.variants.length <= 0
            ? getLocalizedValue(product.title)
            : getLocalizedValue(product.title) +
              " - " +
              selectedVariantName.join(", "),
        image: selectedImage,
        variant: selectVariant || {},
        price:
          product.variants.length === 0
            ? getNumber(product.prices.price)
            : getNumber(price),
        originalPrice:
          product.variants.length === 0
            ? getNumber(product.prices.originalPrice)
            : getNumber(originalPrice),
        quantity,
      };

      addItem(newItem);
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
