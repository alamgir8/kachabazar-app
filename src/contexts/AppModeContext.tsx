import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppMode = "store" | "delivery";

interface AppModeContextValue {
  /** Current app mode */
  mode: AppMode;
  /** Whether the mode has been loaded from storage */
  isReady: boolean;
  /** Whether this is the first launch (no mode chosen yet) */
  isFirstLaunch: boolean;
  /** Switch to a new mode */
  setMode: (mode: AppMode) => Promise<void>;
  /** Reset to first launch state (shows chooser again) */
  resetMode: () => Promise<void>;
}

const STORAGE_KEY = "@kachabazar/appMode";
const FIRST_LAUNCH_KEY = "@kachabazar/hasChosenMode";

const AppModeContext = createContext<AppModeContextValue | undefined>(
  undefined,
);

export const AppModeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [mode, setModeState] = useState<AppMode>("store");
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedMode, hasChosen] = await AsyncStorage.multiGet([
          STORAGE_KEY,
          FIRST_LAUNCH_KEY,
        ]);

        if (hasChosen[1] === "true") {
          setIsFirstLaunch(false);
        }

        if (storedMode[1] === "delivery" || storedMode[1] === "store") {
          setModeState(storedMode[1]);
        }
      } catch {
        // Defaults are fine
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setMode = useCallback(async (newMode: AppMode) => {
    setModeState(newMode);
    setIsFirstLaunch(false);
    await AsyncStorage.multiSet([
      [STORAGE_KEY, newMode],
      [FIRST_LAUNCH_KEY, "true"],
    ]);
  }, []);

  const resetMode = useCallback(async () => {
    setModeState("store");
    setIsFirstLaunch(true);
    await AsyncStorage.multiRemove([STORAGE_KEY, FIRST_LAUNCH_KEY]);
  }, []);

  const value = useMemo<AppModeContextValue>(
    () => ({ mode, isReady, isFirstLaunch, setMode, resetMode }),
    [mode, isReady, isFirstLaunch, setMode, resetMode],
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error("useAppMode must be used within AppModeProvider");
  return ctx;
};
