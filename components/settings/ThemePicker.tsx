import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEMES, THEME_NAMES, Theme } from "@/constants/themes";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function ThemePicker() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <View className="px-1 py-1">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
        {THEME_NAMES.map((themeName) => {
          const themeConfig = THEMES[themeName];
          const isActive = theme === themeName;

          return (
            <Pressable
              key={themeName}
              onPress={() => setTheme(themeName)}
              className={`items-center gap-2 p-3 mx-1 rounded-lg border-2 ${
                isActive ? "border-blue-400" : "border-gray-300"
              }`}
              style={{
                backgroundColor: themeConfig.surface,
              }}
            >
              {/* Color Preview */}
              <View className="flex-row gap-1.5">
                <View
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themeConfig.primary }}
                />
                <View
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themeConfig.primaryLight }}
                />
                <View
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themeConfig.accent }}
                />
              </View>

              {/* Theme Name */}
              <Text
                className="text-xs font-medium text-center"
                style={{ color: themeConfig.text }}
              >
                {themeConfig.name}
              </Text>

              {/* Active Checkmark */}
              {isActive && (
                <Ionicons name="checkmark-circle" size={16} color="#60a5fa" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
