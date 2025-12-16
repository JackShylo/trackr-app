import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string, category?: string) => void;
}

export default function AddTodoModal({ visible, onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onSubmit(text.trim(), category.trim().toLowerCase() || undefined);
      setText("");
      setCategory("");
      onClose();
    }
  };

  const handleClose = () => {
    setText("");
    setCategory("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* CARD */}
      <View style={styles.centerWrapper} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={styles.title}>Add New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Type your task…"
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <TextInput
            style={styles.input}
            placeholder="Category (optional)"
            value={category}
            onChangeText={setCategory}
            autoFocus
          />

          <View style={styles.buttons}>
            <Pressable onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleAdd} style={styles.addBtn}>
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  centerWrapper: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  card: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelBtn: {
    marginRight: 16,
  },
  cancelText: {
    fontSize: 16,
    color: "#6B7280",
  },

  addBtn: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
