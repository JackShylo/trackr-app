import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface SectionProps {
    title: string,
    children?: React.ReactNode
}

export default function Section({ title, children }: SectionProps) {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <View className="mb-6">
      <Text className="uppercase text-xs mb-2" style={{ color: themeConfig.textSecondary }}>
        {title}
      </Text>
      <View className="rounded-xl divide-y" style={{ backgroundColor: themeConfig.surface, borderColor: themeConfig.textSecondary }}>
        {children}
      </View>
    </View>
  );
}
