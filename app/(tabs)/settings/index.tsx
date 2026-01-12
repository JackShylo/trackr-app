import React, { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

import Section from "@/components/settings/Section"
import Row from "@/components/settings/Row";
import ThemePicker from "@/components/settings/ThemePicker";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <View className="flex-1 px-5 pt-6" style={{ backgroundColor: themeConfig.background }}>
      <Text className="text-2xl font-semibold mb-6" style={{ color: themeConfig.text }}>
        Settings
      </Text>

      <Section title="Appearance">
        <View className="px-4 py-3">
          <Text className="text-gray-700 text-sm mb-3">Theme</Text>
          <ThemePicker />
        </View>
      </Section>

      <Section title="Behavior">
        <Row label="Default Sort" value="Chronological" />
        <Row label="Confirm Deletes" value="True" />
      </Section>

      <Section title="Data">
        <Row label="Export Data" />
        <Row label="Clear All Data" danger />
      </Section>

      <Section title="About">
        <Row label="Version" value="1.0.0" />
      </Section>
    </View>
  );
}
