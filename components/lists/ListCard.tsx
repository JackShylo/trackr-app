import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { List } from "@/types/List";

interface ListCardProps {
  list: List;
  onPress: () => void;
  onOpenMenu?: () => void;
}

export default function ListCard({ list, onPress, onOpenMenu }: ListCardProps) {
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

      {/* List Title */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">
          {list.title}
        </Text>
        {/* Shows how many items in list */}
        <Text className="text-gray-400 text-xs mt-0.5">
          {list.items.length} item{list.items.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Action Button */}
      <Pressable onPress={onOpenMenu} className="p-2">
        <Ionicons name="ellipsis-vertical" color="white" size={20} />
      </Pressable>
    </Pressable>
  );
}
