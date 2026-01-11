import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LIST_ICONS } from "@/constants/listIcons";

export type ListIcon = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

interface Props {
  value?: ListIcon;
  onChange: (icon: ListIcon) => void;
}

export default function ListIconPicker({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {LIST_ICONS.map((icon) => {
        const selected =
          value?.name === icon.name && value?.color === icon.color;

        return (
          <Pressable
            key={icon.name}
            onPress={() => onChange(icon as ListIcon)}
            className={`
              w-12 h-12 rounded-xl items-center justify-center
              ${selected ? "bg-white/20" : "bg-white/10"}
            `}
          >
            <Ionicons
              name={icon.name as any}
              size={22}
              color={icon.color}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
