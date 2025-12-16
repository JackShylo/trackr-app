import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Todo } from "../../types/Todo";

interface Props {
  visible: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSave: (id: string, text: string, notes?: string, category?: string) => void;
}

export default function EditTodoModal({
  visible,
  todo,
  onClose,
  onSave,
}: Props) {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setNotes(todo.notes ?? "");
      setCategory(todo.category ?? "");
    }
  }, [todo]);

  if (!todo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <KeyboardAvoidingView behavior="padding" className="w-full">
          <View className="bg-white rounded-2xl p-5 shadow-lg">
            <Text className="text-lg font-semibold mb-4">Edit Todo</Text>

            {/* Title */}
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-3"
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


            {/* Notes */}
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-3 min-h-[80px]"
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes (optional)"
              multiline
              textAlignVertical="top"
            />

            {/* Category */}
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
              value={category}
              onChangeText={setCategory}
              placeholder="Category (optional)"
            />

            {/* Actions */}
            <View className="flex-row justify-end space-x-5">
              <Pressable onPress={onClose}>
                <Text className="text-gray-500 text-base">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  onSave(
                    todo.id,
                    text.trim(),
                    notes.trim() || undefined,
                    category.trim() || undefined
                  );
                  onClose();
                }}
              >
                <Text className="text-blue-600 font-semibold text-base">
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
