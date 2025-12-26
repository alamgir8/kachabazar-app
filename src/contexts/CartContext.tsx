import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SECURE_STORAGE_KEYS } from "@/constants";
import { CartItem, Product } from "@/types";
import { getLocalizedValue, getProductImage } from "@/utils";

interface AddToCartArgs {
  product: Product;
  quantity?: number;
  variantLabel?: string;
  priceOverride?: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isEmpty: boolean;
  addItem: (args: AddToCartArgs) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => Promise<void>;
  replaceCart: (items: CartItem[]) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const computeItemSubtotal = (price: number, quantity: number) =>
  Number((price * quantity).toFixed(2));

const hydrateCart = async (): Promise<CartItem[]> => {
  try {
    const stored = await AsyncStorage.getItem(SECURE_STORAGE_KEYS.cart);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn("Failed to hydrate cart", error);
    return [];
  }
};

const persistCart = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(SECURE_STORAGE_KEYS.cart, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to persist cart", error);
  }
};

const buildItemId = (product: Product, variantLabel?: string) =>
  variantLabel ? `${product._id}:${variantLabel}` : product._id;

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await hydrateCart();
      setItems(stored);
    })();
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)),
    [items]
  );

  const isEmpty = items.length === 0;

  const applyAndPersist = useCallback(
    (updater: (prev: CartItem[]) => CartItem[]) => {
      setItems((prev) => {
        const next = updater(prev);
        persistCart(next);
        return next;
      });
    },
    []
  );

  const addItem = useCallback(
    ({
      product,
      quantity = 1,
      variantLabel,
      priceOverride,
      image,
    }: AddToCartArgs) => {
      const id = buildItemId(product, variantLabel);
      const price = priceOverride ?? product.prices?.price ?? 0;
      const originalPrice = product.prices?.originalPrice ?? price;
      const discount =
        originalPrice > price
          ? originalPrice - price
          : product.prices?.discount;

      applyAndPersist((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === id);

        if (existingIndex !== -1) {
          const next = [...prev];
          const existing = next[existingIndex];
          const updatedQuantity = existing.quantity + quantity;

          next[existingIndex] = {
            ...existing,
            quantity: updatedQuantity,
            subtotal: computeItemSubtotal(existing.price, updatedQuantity),
          };

          return next;
        }

        const newItem: CartItem = {
          id,
          productId: product._id,
          name: getLocalizedValue(product.title),
          slug: product.slug,
          image: image || getProductImage(product),
          quantity,
          price,
          originalPrice,
          discount,
          variant: variantLabel,
          product,
          subtotal: computeItemSubtotal(price, quantity),
        };

        return [...prev, newItem];
      });
    },
    [applyAndPersist]
  );

  const increment = useCallback(
    (itemId: string) => {
      applyAndPersist((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: computeItemSubtotal(item.price, item.quantity + 1),
              }
            : item
        )
      );
    },
    [applyAndPersist]
  );

  const decrement = useCallback(
    (itemId: string) => {
      applyAndPersist((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
                subtotal: computeItemSubtotal(item.price, item.quantity - 1),
              }
            : item
        );
        // Remove items with quantity 0 or less
        return updated.filter((item) => item.quantity > 0);
      });
    },
    [applyAndPersist]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      applyAndPersist((prev) => prev.filter((item) => item.id !== itemId));
    },
    [applyAndPersist]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    await persistCart([]);
  }, []);

  const replaceCart = useCallback(async (nextItems: CartItem[]) => {
    setItems(nextItems);
    await persistCart(nextItems);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      isEmpty,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      replaceCart,
    }),
    [
      items,
      totalItems,
      subtotal,
      isEmpty,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      replaceCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
