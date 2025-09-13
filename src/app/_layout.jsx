import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerLabel: "menu", title: "Home" }}
        />
        <Drawer.Screen
          name="cart"
          options={{ drawerLabel: "Cart", title: "Cart" }}
        />
        <Drawer.Screen
          name="account"
          options={{ drawerLabel: "Login", title: "Login" }}
        />
        {/* Add more screens as needed */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
