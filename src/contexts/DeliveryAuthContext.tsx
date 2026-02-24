import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { API_BASE_URL } from "@/constants";

// ─── Types ───────────────────────────────────────────────────────
export interface DeliveryBoyUser {
  _id: string;
  name: Record<string, string> | string;
  email: string;
  phone?: string;
  image?: string;
  role: "delivery-boy";
}

interface DeliveryLoginResponse {
  token: string;
  _id: string;
  name: Record<string, string> | string;
  email: string;
  phone?: string;
  image?: string;
  role: "delivery-boy";
  iv: string;
  data: string;
}

interface DeliveryAuthContextValue {
  user: DeliveryBoyUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Storage keys ────────────────────────────────────────────────
const KEYS = {
  token: "@kachabazar/delivery_token",
  user: "@kachabazar/delivery_user",
} as const;

// ─── Context ─────────────────────────────────────────────────────
const DeliveryAuthContext = createContext<DeliveryAuthContextValue | undefined>(
  undefined,
);

export const DeliveryAuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<DeliveryBoyUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Hydrate from storage
  useEffect(() => {
    (async () => {
      try {
        const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
          KEYS.token,
          KEYS.user,
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // ignore
      } finally {
        setIsHydrating(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/delivery/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Login failed" }));
      throw new Error(err.message || "Login failed");
    }

    const data: DeliveryLoginResponse = await res.json();

    const deliveryUser: DeliveryBoyUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      image: data.image,
      role: "delivery-boy",
    };

    setToken(data.token);
    setUser(deliveryUser);

    await AsyncStorage.multiSet([
      [KEYS.token, data.token],
      [KEYS.user, JSON.stringify(deliveryUser)],
    ]);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove([KEYS.token, KEYS.user]);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delivery/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profile = await res.json();
        const updated: DeliveryBoyUser = {
          _id: profile._id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          image: profile.image,
          role: "delivery-boy",
        };
        setUser(updated);
        await AsyncStorage.setItem(KEYS.user, JSON.stringify(updated));
      }
    } catch {
      // silent
    }
  }, [token]);

  const value = useMemo<DeliveryAuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isHydrating,
      login,
      logout,
      refreshUser,
    }),
    [user, token, isHydrating, login, logout, refreshUser],
  );

  return (
    <DeliveryAuthContext.Provider value={value}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};

export const useDeliveryAuth = () => {
  const ctx = useContext(DeliveryAuthContext);
  if (!ctx)
    throw new Error("useDeliveryAuth must be used within DeliveryAuthProvider");
  return ctx;
};

/** Helper to get display name string from delivery boy name field */
export const getDeliveryBoyDisplayName = (
  name: Record<string, string> | string | undefined,
): string => {
  if (!name) return "Delivery Partner";
  if (typeof name === "string") return name;
  return name.en || Object.values(name)[0] || "Delivery Partner";
};
