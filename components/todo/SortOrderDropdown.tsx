import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

interface Props {
  value: "custom" | "alpha" | "chrono";
  onChange: (v: "custom" | "alpha" | "chrono") => void;
}

export default function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Custom", value: "custom" as const },
    { label: "A–Z", value: "alpha" as const },
    { label: "Oldest", value: "chrono" as const },
  ];

  const current = options.find((o) => o.value === value)?.label ?? "Sort";

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.button}
        android_ripple={{ color: "#e2e8f0" }}
      >
        <Text style={styles.buttonText}>{current} ▼</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Backdrop: touch closes modal */}
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Centered menu (always reachable) */}
        <View style={styles.menuWrapper} pointerEvents="box-none">
          <View style={styles.menu}>
            {options.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E5E7EB", // gray-200
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  menuWrapper: {
    // this centers the menu — keeps it reachable above backdrop
    position: "absolute",
    top: "30%", // tweak to position the menu where you want
    left: 0,
    right: 0,
    alignItems: "center",
  },
  menu: {
    width: 160,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingVertical: 6,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
  },
});
