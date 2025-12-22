import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { ListItem } from "../../types/ListItem";

interface Props {
  visible: boolean;
  list: ListItem | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<ListItem, "title" | "category">>) => void;
}

export default function UpdateItemModal({ visible, list, onClose, onSave }: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (list) {
      setText(list.title);
      setCategory(list.category || "");
    }
  }, [list]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <KeyboardAvoidingView behavior="padding" className="w-full">
          <View className="bg-gray-800 rounded-2xl p-5 shadow-lg">
            <Text className="text-lg text-white font-semibold mb-4">Edit Todo</Text>

            {/* Title */}
            <TextInput
              className="bg-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-white mb-3"
              value={text}
              onChangeText={setText}
              placeholder="Title"
              autoFocus
              returnKeyType="next"
            />
            {text.length === 0 && (
                <Text className="text-red-500 text-sm mb-2">
                    Title cannot be empty
                </Text>
                )}

            {/* Category */}
            <TextInput
              className="bg-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-white mb-4"
              value={category}
              onChangeText={setCategory}
              placeholder="Category (optional)"
            />

          {/* Actions */}
          <View className="flex-row justify-end">
            <Pressable
              className="m-1 bg-green-500 px-4 py-2 rounded-lg"
              onPress={() => {
                if (list) {
                  onSave(
                    list.id,
                    { title: text.trim(), category: category.trim() || undefined }
                  );
                }
                onClose();
              }}
            >
              <Text className="font-semibold text-white">Save</Text>
            </Pressable>
            <Pressable className="m-1 bg-red-500 px-4 py-2 rounded-lg" onPress={onClose}>
              <Text className="font-semibold text-white">Cancel</Text>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
