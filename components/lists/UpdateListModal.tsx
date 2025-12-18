import { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import { ListItem } from "../../types/ListItem";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

export default function UpdateListModal({ visible, onClose, onSave }: Props) {
  
  const [listTitle, setListTitle] = useState("");

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
            <Text className="text-lg font-semibold mb-4">Edit List</Text>

            {/* Title */}
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-3"
              value={listTitle}
              onChangeText={setListTitle}
              placeholder="Rename List"
              autoFocus
              returnKeyType="next"
            />
            {listTitle.length === 0 && (
                <Text className="text-red-500 text-sm mb-2">
                    Title cannot be empty
                </Text>
                )}

            {/* Actions */}
            <View className="flex-row justify-end space-x-5">
              <Pressable onPress={onClose}>
                <Text className="text-gray-500 text-base">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {onSave(listTitle.trim());
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
