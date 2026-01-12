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
            {listTitle?.length === 0 && (
                <Text className="text-red-500 text-sm mb-2">
                    Title cannot be empty
                </Text>
            )}

            {/* Icon Picker */}
            <Pressable 
              onPress={() => setShowIconPicker(true)}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            >
              <Text className="text-base text-gray-700 mb-2">Change Icon</Text>
              {selectedIcon && (
                <Text className="text-sm text-gray-500">
                  Selected: {selectedIcon.name}
                </Text>
              )}
            </Pressable>

            {/* Actions */}
            <View className="flex-row justify-end space-x-5">
              <Pressable onPress={onClose}>
                <Text className="text-gray-500 text-base">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  onSave(listTitle?.trim() || "", selectedIcon);
                  onClose();
                }}
              >
                <Text className="text-blue-600 font-semibold text-base">
                  Save
                </Text>
              </Pressable>
            </View>
      {/* Icon Picker Modal */}
      <ListIconPicker
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={(icon) => {
          setSelectedIcon(icon);
          setShowIconPicker(false);
        }}
        selectedIcon={selectedIcon}
      />
          </View>
        </KeyboardAvoidingView>
        
      </View>

    </Modal>
  );
}
