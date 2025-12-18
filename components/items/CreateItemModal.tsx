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

export default function CreateItemModal({ visible, onClose, onSubmit }: Props) {
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
        <View className="absolute inset-0 bg-black bg-opacity-40"/>
      </TouchableWithoutFeedback>

      {/* CARD */}
      <View className="absolute top-1/3 left-0 right-0 items-center" pointerEvents="box-none">
        <View className="w-4/5 bg-white rounded-xl p-5 shadow-lg">
          <Text className="text-lg font-semibold mb-4">Add Task</Text>
          <TextInput
            className="bg-gray-200 p-3 rounded-lg mb-4 text-base"
            placeholder="Write a new task"
            value={text}
            onChangeText={setText}
            autoFocus
          />
          <View className="flex-row justify-end">
            <Pressable className="mr-4" onPress={handleClose}>
              <Text className="font-semibold text-gray-600">Cancel</Text>
            </Pressable>
            <Pressable className="bg-blue-500 px-4 py-2 rounded-lg" onPress={handleAdd}>
              <Text className="font-semibold text-white">Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}