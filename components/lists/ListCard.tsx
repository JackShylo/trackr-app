import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { List } from "@/types/List";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface ListCardProps {
  list: List;
  onPress: () => void;
  onOpenMenu?: () => void;
}

export default function ListCard({ list, onPress, onOpenMenu }: ListCardProps) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl p-4 mb-3 flex-row items-center"
      style={{ backgroundColor: themeConfig.surface }}
    >
      {/* Icon / Color */}
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: list.icon?.color || themeConfig.primary }}
      >
        <Ionicons name={list.icon && typeof list.icon.name === "string" ? list.icon.name : "list-outline"} size={20} color="white" />
      </View>

      {/* List Title */}
      <View className="flex-1">
        <Text 
          className="font-semibold text-base"
          style={{ color: themeConfig.text }}
        >
          {list.title}
        </Text>
        {/* Shows how many items in list */}
        <Text 
          className="text-xs mt-0.5"
          style={{ color: themeConfig.textSecondary }}
        >
          {list.items.length} item{list.items.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Action Button */}
      <Pressable onPress={onOpenMenu} className="p-2">
        <Ionicons name="ellipsis-vertical" color={themeConfig.text} size={20} />
      </Pressable>
    </Pressable>
  );
}
