import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { List } from "../../types/List";

interface Props {
  list: List;
  onPress: () => void;
  onDelete?: () => void
}

export default function ListCard({ list, onPress, onDelete }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center"
    >
      {/* Icon / Color */}
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: list.color ?? "#2563EB" }}
      >
        <Ionicons name="list-outline" size={20} color="white" />
      </View>

      {/* Title */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">
          {list.title}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          {list.items.length} item{list.items.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />

      {/* Delete Button */}
      <Pressable onPress={onDelete} className="ml-3">
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
      </Pressable>
    </Pressable>
  );
}
