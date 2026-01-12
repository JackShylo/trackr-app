import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const label =
    value === "custom" ? "Custom" :
    value === "alpha" ? "A–Z" :
    "Oldest";

  return (
    <View className="relative z-50" style={{ zIndex: 50, elevation: 50 }}>
      {/* Button */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-lg shadow"
      >
        <Text className="font-medium">{label}</Text>
        <Ionicons name="chevron-down" size={16} />
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
            className="absolute top-8 right-0 bg-white rounded-lg shadow w-40"
            style={{ zIndex: 51, elevation: 51 }}
          >
            <Option
              label="Custom order"
              active={value === "custom"}
              onPress={() => onChange("custom")}
            />
            <Option
              label="Alphabetical"
              active={value === "alpha"}
              onPress={() => onChange("alpha")}
            />
            <Option
              label="Oldest first"
              active={value === "chrono"}
              onPress={() => onChange("chrono")}
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
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-3 ${
        active ? "bg-blue-50" : ""
      }`}
    >
      <Text className={active ? "text-blue-600 font-medium" : ""}>
        {label}
      </Text>
    </Pressable>
  );
}
