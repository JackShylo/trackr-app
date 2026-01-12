import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

type SortMode = "custom" | "alpha" | "chrono";

interface Props {
  value: SortMode;
  onChange: (value: SortMode) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function SortDropdown({
  value,
  onChange,
  open,
  onToggle,
  onClose,
}: Props) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  const label =
    value === "custom" ? "Custom" :
    value === "alpha" ? "A–Z" :
    "Oldest";

  return (
    <View className="relative z-50" style={{ zIndex: 50, elevation: 50 }}>
      {/* Button */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-2 px-4 py-2 rounded-lg shadow"
        style={{ backgroundColor: themeConfig.surface }}
      >
        <Text className="font-medium" style={{ color: themeConfig.text }}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color={themeConfig.text} />
      </Pressable>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop (captures outside taps) */}
          <Pressable
            onPress={onClose}
            className="absolute inset-0"
            style={{ zIndex: 50 }}
          />

          <View
            className="absolute top-8 right-0 rounded-lg shadow w-40"
            style={{ zIndex: 51, elevation: 51, backgroundColor: themeConfig.surface }}
          >
            <Option
              label="Custom order"
              active={value === "custom"}
              onPress={() => onChange("custom")}
              themeConfig={themeConfig}
            />
            <Option
              label="Alphabetical"
              active={value === "alpha"}
              onPress={() => onChange("alpha")}
              themeConfig={themeConfig}
            />
            <Option
              label="Oldest first"
              active={value === "chrono"}
              onPress={() => onChange("chrono")}
              themeConfig={themeConfig}
            />
          </View>
        </>
      )}
    </View>
  );
}

function Option({
  label,
  active,
  onPress,
  themeConfig,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  themeConfig: typeof THEMES[keyof typeof THEMES];
}) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3"
      style={{ backgroundColor: active ? themeConfig.primaryLight : "transparent" }}
    >
      <Text style={{
        color: active ? themeConfig.primary : themeConfig.text,
        fontWeight: active ? "600" : "400",
      }}>
        {label}
      </Text>
    </Pressable>
  );
}
