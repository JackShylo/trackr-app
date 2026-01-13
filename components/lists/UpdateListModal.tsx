import { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import ListIconPicker from "./ListIconPicker";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, icon?: { name: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap; color: string }) => void;
  initialTitle?: string;
  initialIcon?: { name: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap; color: string };
}

export default function UpdateListModal({ visible, onClose, onSave, initialTitle, initialIcon }: Props) {
  const [listTitle, setListTitle] = useState(initialTitle);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setListTitle(initialTitle);
      setSelectedIcon(initialIcon);
    }
  }, [visible, initialTitle, initialIcon]);

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
            <Text className="text-lg text-white font-semibold mb-4">Edit List</Text>

            {/* Title */}
            <TextInput
              className="border text-white border-gray-300 rounded-xl px-4 py-3 text-base mb-3"
              value={listTitle}
              onChangeText={setListTitle}
              placeholder="Rename List"
              autoFocus
              returnKeyType="next"
            />
            {listTitle?.length === 0 && (
                <Text className="text-red-500 text-sm mb-2">
                    Title cannot be empty
                </Text>
            )}

              {/* Icon Picker Modal */}
              <ListIconPicker
                visible={true}
                onClose={() => setShowIconPicker(false)}
                onSelectIcon={(icon) => {
                  setSelectedIcon(icon);
                }}
                selectedIcon={selectedIcon}
              />
            {/* Actions */}
            <View className="flex-row justify-end">
              <Pressable
                onPress={() => {
                  onSave(listTitle?.trim() || "", selectedIcon);
                  onClose();
                }}
                className="m-1 bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold text-base">
                  Save
                </Text>
              </Pressable>

              <Pressable className="m-1 bg-red-500 px-4 py-2 rounded-lg" onPress={onClose}>
                <Text className="text-white text-base">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
        
      </View>

    </Modal>
  );
}
