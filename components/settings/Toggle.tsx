import { View, Text, Pressable } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <Pressable 
      onPress={() => onChange(!value)}
      className="flex-row justify-between items-center px-4 py-3"
    >
      <Text style={{ color: themeConfig.text }}>
        {label}
      </Text>
      <View
        className="w-12 h-7 rounded-full items-center justify-start flex-row px-1"
        style={{ backgroundColor: value ? themeConfig.primaryLight : themeConfig.textSecondary }}
      >
        <View
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: "white",
            transform: [{ translateX: value ? 20 : 0 }],
          }}
        />
      </View>
    </Pressable>
  );
}
