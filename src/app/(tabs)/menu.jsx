import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import DrawerMenu from "@/components/ui/drawer-menu";

export default function MenuScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setDrawerVisible(true)}
      >
        <Text style={styles.menuText}>Open Menu</Text>
      </TouchableOpacity>
      <Modal
        visible={drawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.drawerContainer}>
          <DrawerMenu onClose={() => setDrawerVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },
  menuButton: {
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
