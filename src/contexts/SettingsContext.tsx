import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import {
  fetchGlobalSetting,
  fetchLanguages,
  fetchStoreCustomization,
  fetchStoreSetting
} from "@/services/settings";
import { GlobalSetting } from "@/services/settings";
import { StoreCustomization, StoreSetting } from "@/types";

interface SettingsContextValue {
  globalSetting?: GlobalSetting;
  storeSetting?: StoreSetting;
  storeCustomization?: StoreCustomization;
  languages?: Array<{
    name: string;
    code: string;
    native?: string;
    status: string;
  }>;
  isLoading: boolean;
  refetch: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const customizationQuery = useQuery({
    queryKey: [QUERY_KEYS.settings, "customization"],
    queryFn: fetchStoreCustomization,
    staleTime: 1000 * 60 * 5
  });

  const globalQuery = useQuery({
    queryKey: [QUERY_KEYS.global],
    queryFn: fetchGlobalSetting,
    staleTime: 1000 * 60 * 5
  });

  const storeSettingQuery = useQuery({
    queryKey: [QUERY_KEYS.settings, "store"],
    queryFn: fetchStoreSetting,
    staleTime: 1000 * 60 * 5
  });

  const languageQuery = useQuery({
    queryKey: [QUERY_KEYS.settings, "languages"],
    queryFn: fetchLanguages,
    staleTime: 1000 * 60 * 60
  });

  const isLoading =
    customizationQuery.isLoading ||
    globalQuery.isLoading ||
    storeSettingQuery.isLoading ||
    languageQuery.isLoading;

  const value = useMemo<SettingsContextValue>(
    () => ({
      globalSetting: globalQuery.data,
      storeSetting: storeSettingQuery.data,
      storeCustomization: customizationQuery.data,
      languages: languageQuery.data,
      isLoading,
      refetch: () => {
        customizationQuery.refetch();
        globalQuery.refetch();
        storeSettingQuery.refetch();
        languageQuery.refetch();
      }
    }),
    [
      customizationQuery,
      globalQuery,
      isLoading,
      languageQuery,
      storeSettingQuery
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
