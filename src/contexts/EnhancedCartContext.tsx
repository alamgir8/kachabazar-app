import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SECURE_STORAGE_KEYS } from "@/constants";
import Toast from "react-native-toast-message";

interface CartItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
  variant?: {
    name: string;
    value: string;
  };
}

interface Cart {
  items: CartItem[];
  itemCount: number;
  subTotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  coupon?: {
    code: string;
    discount: number;
  };
}

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantName?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantName?: string
  ) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setShippingCost: (cost: number) => void;
  isInCart: (productId: string, variantName?: string) => boolean;
  getItemQuantity: (productId: string, variantName?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    itemCount: 0,
    subTotal: 0,
    discount: 0,
    shippingCost: 0,
    total: 0,
  });

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(SECURE_STORAGE_KEYS.cart);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(
        SECURE_STORAGE_KEYS.cart,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  };

  const calculateTotals = useCallback(
    (
      items: CartItem[],
      discount = 0,
      shippingCost = 0,
      coupon?: Cart["coupon"]
    ) => {
      const subTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      let finalDiscount = discount;
      if (coupon) {
        finalDiscount += coupon.discount;
      }

      const total = Math.max(0, subTotal - finalDiscount + shippingCost);

      return {
        items,
        itemCount,
        subTotal,
        discount: finalDiscount,
        shippingCost,
        total,
        coupon,
      };
    },
    []
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variant?.name === item.variant?.name
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update existing item quantity
          newItems = [...prevCart.items];
          const newQuantity =
            newItems[existingItemIndex].quantity + (item.quantity || 1);

          // Check stock
          if (newQuantity > item.stock) {
            Toast.show({
              type: "error",
              text1: "Stock Limit",
              text2: "Cannot add more items than available stock",
            });
            return prevCart;
          }

          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newQuantity,
          };
        } else {
          // Add new item
          newItems = [
            ...prevCart.items,
            {
              ...item,
              quantity: item.quantity || 1,
            },
          ];
        }

        Toast.show({
          type: "success",
          text1: "Added to Cart",
          text2: `${item.title} added successfully`,
        });

        return calculateTotals(
          newItems,
          prevCart.discount,
          prevCart.shippingCost,
          prevCart.coupon
        );
      });
    },
    [calculateTotals]
  );

  const removeItem = useCallback(
    (productId: string, variantName?: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items.filter(
          (item) =>
            !(
              item.productId === productId && item.variant?.name === variantName
            )
        );

        Toast.show({
          type: "info",
          text1: "Removed from Cart",
        });

        return calculateTotals(
          newItems,
          prevCart.discount,
          prevCart.shippingCost,
          prevCart.coupon
        );
      });
    },
    [calculateTotals]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantName?: string) => {
      if (quantity < 1) {
        removeItem(productId, variantName);
        return;
      }

      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) => {
          if (
            item.productId === productId &&
            item.variant?.name === variantName
          ) {
            // Check stock
            if (quantity > item.stock) {
              Toast.show({
                type: "error",
                text1: "Stock Limit",
                text2: `Only ${item.stock} items available`,
              });
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        });

        return calculateTotals(
          newItems,
          prevCart.discount,
          prevCart.shippingCost,
          prevCart.coupon
        );
      });
    },
    [calculateTotals, removeItem]
  );

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      itemCount: 0,
      subTotal: 0,
      discount: 0,
      shippingCost: 0,
      total: 0,
    });
    Toast.show({
      type: "info",
      text1: "Cart Cleared",
    });
  }, []);

  const applyCoupon = useCallback(
    (code: string, discount: number) => {
      setCart((prevCart) => {
        const newCart = calculateTotals(
          prevCart.items,
          prevCart.discount,
          prevCart.shippingCost,
          { code, discount }
        );

        Toast.show({
          type: "success",
          text1: "Coupon Applied",
          text2: `You saved $${discount.toFixed(2)}`,
        });

        return newCart;
      });
    },
    [calculateTotals]
  );

  const removeCoupon = useCallback(() => {
    setCart((prevCart) => {
      return calculateTotals(
        prevCart.items,
        prevCart.discount,
        prevCart.shippingCost
      );
    });
  }, [calculateTotals]);

  const setShippingCost = useCallback(
    (cost: number) => {
      setCart((prevCart) => {
        return calculateTotals(
          prevCart.items,
          prevCart.discount,
          cost,
          prevCart.coupon
        );
      });
    },
    [calculateTotals]
  );

  const isInCart = useCallback(
    (productId: string, variantName?: string) => {
      return cart.items.some(
        (item) =>
          item.productId === productId && item.variant?.name === variantName
      );
    },
    [cart.items]
  );

  const getItemQuantity = useCallback(
    (productId: string, variantName?: string) => {
      const item = cart.items.find(
        (item) =>
          item.productId === productId && item.variant?.name === variantName
      );
      return item?.quantity || 0;
    },
    [cart.items]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setShippingCost,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
