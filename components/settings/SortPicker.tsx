import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

type SortMode = "chrono" | "alpha" | "reverse-chrono";

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
  { mode: "alpha", label: "Alphabetical" },
  { mode: "chrono", label: "Oldest first" },
  { mode: "reverse-chrono", label: "Newest first" },
];

export default function SortPicker() {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  const listSortMode = useSettingsStore((s) => s.listSortMode);
  const setListSortMode = useSettingsStore((s) => s.setListSortMode);
  const setItemSortMode = useSettingsStore((s) => s.setItemSortMode);

  const handleSortChange = async (mode: SortMode) => {
    await setListSortMode(mode);
    await setItemSortMode(mode);
  };

  return (
    <View className="px-4 py-3">
      <Text className="text-sm mb-3" style={{ color: themeConfig.textSecondary }}>
        Default Sort Order
      </Text>
      <View className="gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = listSortMode === option.mode;
          return (
            <Pressable
              key={option.mode}
              onPress={() => handleSortChange(option.mode)}
              className="flex-row items-center p-3 rounded-lg border"
              style={{
                backgroundColor: isActive ? themeConfig.primaryLight : themeConfig.surface,
                borderColor: isActive ? themeConfig.primaryLight : themeConfig.textSecondary,
              }}
            >
              <View
                className="w-4 h-4 rounded-full border-2 mr-3 items-center justify-center"
                style={{
                  borderColor: isActive ? "white" : themeConfig.textSecondary,
                  backgroundColor: isActive ? themeConfig.primaryLight : "transparent",
                }}
              >
                {isActive && (
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "white" }}
                  />
                )}
              </View>
              <Text
                style={{
                  color: isActive ? "white" : themeConfig.text,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
