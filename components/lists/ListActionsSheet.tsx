import { Modal, View, Pressable, Text } from "react-native";
import { List } from "@/types/List";

type Props = {
  list: List | null;
  visible: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export default function ListActionsSheet({
  list,
  visible,
  onClose,
  onRename,
  onDelete,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/40"
        onPress={onClose}
      />

      {/* Sheet */}
      <View className="bg-primary rounded-t-3xl px-4 pt-4 pb-8">
        <View className="h-1 w-12 bg-gray-600 rounded-full self-center mb-4" />

        <Pressable className="py-3" onPress={onRename}>
          <Text className="text-white text-base">Rename</Text>
        </Pressable>

        <Pressable className="py-3" onPress={onDelete}>
          <Text className="text-red-400 text-base">Delete</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
