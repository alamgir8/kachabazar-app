import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SECURE_STORAGE_KEYS } from "@/constants";
import {
  addShippingAddress,
  fetchCustomer,
  getShippingAddress,
  login as loginRequest,
  refreshSession,
  updateCustomer
} from "@/services/auth";
import { Customer, ShippingAddress } from "@/types";

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  image?: string;
}

interface AuthContextValue {
  user: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  shippingAddress: ShippingAddress | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  upsertShippingAddress: (address: ShippingAddress) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadStoredSession = async () => {
  const [token, refresh, userJson, cartJson] = await AsyncStorage.multiGet([
    SECURE_STORAGE_KEYS.accessToken,
    SECURE_STORAGE_KEYS.refreshToken,
    SECURE_STORAGE_KEYS.user,
    SECURE_STORAGE_KEYS.cart // ensures key exists even if unused
  ]);

  return {
    accessToken: token[1],
    refreshToken: refresh[1],
    user: userJson[1] ? (JSON.parse(userJson[1]) as Customer) : null,
    cart: cartJson[1]
  };
};

const persistSession = async ({
  accessToken,
  refreshToken,
  user
}: {
  accessToken: string | null;
  refreshToken: string | null;
  user: Customer | null;
}) => {
  const entries: [string, string][] = [];

  if (accessToken) {
    entries.push([SECURE_STORAGE_KEYS.accessToken, accessToken]);
  }
  if (refreshToken) {
    entries.push([SECURE_STORAGE_KEYS.refreshToken, refreshToken]);
  }
  if (user) {
    entries.push([SECURE_STORAGE_KEYS.user, JSON.stringify(user)]);
  }

  if (entries.length) {
    await AsyncStorage.multiSet(entries);
  }
};

const clearSession = async () => {
  await AsyncStorage.multiRemove([
    SECURE_STORAGE_KEYS.accessToken,
    SECURE_STORAGE_KEYS.refreshToken,
    SECURE_STORAGE_KEYS.user
  ]);
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await loadStoredSession();
        if (!isMounted) return;
        if (stored.accessToken) {
          setAccessToken(stored.accessToken);
        }
        if (stored.refreshToken) {
          setRefreshToken(stored.refreshToken);
        }
        if (stored.user) {
          setUser(stored.user);
        }
      } catch (error) {
        console.warn("Failed to hydrate auth session", error);
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }: LoginInput) => {
    const response = await loginRequest({ email, password });

    const authenticatedUser: Customer = {
      _id: response._id,
      name: response.name,
      email: response.email,
      phone: response.phone,
      image: response.image,
      address: response.address
    };

    setUser(authenticatedUser);
    setAccessToken(response.token);
    setRefreshToken(response.refreshToken);

    await persistSession({
      accessToken: response.token,
      refreshToken: response.refreshToken,
      user: authenticatedUser
    });

    if (response._id) {
      try {
        const addressResponse = await getShippingAddress(
          response._id,
          response.token
        );
        setShippingAddress(addressResponse?.shippingAddress ?? null);
      } catch (error) {
        console.log("Unable to fetch shipping address", error);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const newTokens = await refreshSession(refreshToken);
      const nextAccess =
        (newTokens as unknown as { token?: string }).token ??
        newTokens.accessToken;
      if (nextAccess) {
        setAccessToken(nextAccess);
      }
      if (newTokens.refreshToken && newTokens.refreshToken !== refreshToken) {
        setRefreshToken(newTokens.refreshToken);
      }
      await persistSession({
        accessToken: nextAccess ?? accessToken,
        refreshToken: newTokens.refreshToken ?? refreshToken,
        user
      });
    } catch (error) {
      console.warn("Failed to refresh session", error);
      await logout();
    }
  }, [accessToken, refreshToken, user]);

  const reloadProfile = useCallback(async () => {
    if (!user?._id || !accessToken) return;
    try {
      const [profile, address] = await Promise.all([
        fetchCustomer(user._id, accessToken),
        getShippingAddress(user._id, accessToken)
      ]);

      const nextUser: Customer = {
        ...profile,
        shippingAddress: address.shippingAddress
      };

      setUser(nextUser);
      setShippingAddress(address.shippingAddress ?? null);
      await persistSession({
        accessToken,
        refreshToken,
        user: nextUser
      });
    } catch (error) {
      console.warn("Failed to reload profile", error);
    }
  }, [accessToken, refreshToken, user?._id]);

  const logout = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setShippingAddress(null);
    await clearSession();
  }, []);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!user?._id || !accessToken) return;

      const response = await updateCustomer(user._id, input, accessToken);

      const updatedUser: Customer = {
        _id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        image: response.image,
        address: response.address
      };

      setUser(updatedUser);
      setAccessToken(response.token);
      setRefreshToken(response.refreshToken);

      await persistSession({
        accessToken: response.token,
        refreshToken: response.refreshToken,
        user: updatedUser
      });
    },
    [accessToken, user?._id]
  );

  const upsertShippingAddress = useCallback(
    async (address: ShippingAddress) => {
      if (!user?._id || !accessToken) return;
      await addShippingAddress(user._id, address, accessToken);
      setShippingAddress(address);
      await persistSession({
        accessToken,
        refreshToken,
        user: {
          ...user,
          shippingAddress: address
        }
      });
    },
    [accessToken, refreshToken, user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken && user),
      isHydrating,
      shippingAddress,
      login,
      logout,
      refresh,
      updateProfile,
      upsertShippingAddress,
      reloadProfile
    }),
    [
      user,
      accessToken,
      refreshToken,
      isHydrating,
      shippingAddress,
      login,
      logout,
      refresh,
      updateProfile,
      upsertShippingAddress,
      reloadProfile
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
