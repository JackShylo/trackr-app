import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface RowProps {
    label?: string,
    value?: string,
    danger?: boolean,
    onPress?: () => void
}

export default function Row({ label, value, danger, onPress }: RowProps) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <Pressable onPress={onPress} className="flex-row justify-between items-center px-4 py-3">
      <Text style={{ color: danger ? "#ef4444" : themeConfig.text }}>
        {label}
      </Text>
      {value && (
        <Text className="text-sm" style={{ color: themeConfig.textSecondary }}>{value}</Text>
      )}
    </Pressable>
  );
}
