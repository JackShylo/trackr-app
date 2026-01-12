import { Modal, View, Pressable, Text } from "react-native";
import { List } from "@/types/List";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  onClone: () => void;
  onPin?: () => void;
  isPinned?: boolean;
};

export default function ListActionsSheet({
  visible,
  onClose,
  onRename,
  onDelete,
  onClone,
  onPin,
  isPinned,
}: Props) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

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
      <View className="rounded-t-3xl px-4 pt-4 pb-8" style={{ backgroundColor: themeConfig.surface }}>
        <View className="h-1 w-12 rounded-full self-center mb-4" style={{ backgroundColor: themeConfig.textSecondary }} />

        <Pressable className="py-3" onPress={onRename}>
          <Text style={{ color: themeConfig.text, fontSize: 16 }}>Edit</Text>
        </Pressable>

        <Pressable className="py-3" onPress={onClone}>
          <Text style={{ color: themeConfig.primary, fontSize: 16 }}>Clone</Text>
        </Pressable>

        {onPin && (
          <Pressable className="py-3" onPress={onPin}>
            <Text style={{ color: themeConfig.primary, fontSize: 16 }}>
              {isPinned ? "Unpin" : "Pin"}
            </Text>
          </Pressable>
        )}

        <Pressable className="py-3" onPress={onDelete}>
          <Text style={{ color: "#ef4444", fontSize: 16 }}>Delete</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
