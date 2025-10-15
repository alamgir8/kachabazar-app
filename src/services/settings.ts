import { http } from "@/services/http";
import { StoreCustomization, StoreSetting } from "@/types";

export interface GlobalSetting {
  default_currency?: string;
  currency_symbol?: string;
  email?: string;
  website?: string;
  contact?: string;
  address?: string;
  vat_number?: string;
  company_name?: string;
  [key: string]: unknown;
}

export const fetchStoreCustomization = () =>
  http.get<StoreCustomization>("/setting/store/customization");

export const fetchGlobalSetting = () =>
  http.get<GlobalSetting>("/setting/global");

export const fetchStoreSetting = () =>
  http.get<StoreSetting>("/setting/store-setting");

export const fetchSeoSetting = () =>
  http.get<Record<string, unknown>>("/setting/store-setting/seo");

export const fetchStoreSecretKeys = () =>
  http.get<Record<string, unknown>>("/setting/store-setting/keys");

export const fetchLanguages = () =>
  http.get<
    Array<{
      name: string;
      code: string;
      native?: string;
      status: string;
    }>
  >("/language/show");
