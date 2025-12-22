import  React,{ ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

import Section from "@/components/settings/Section"
import Row from "@/components/settings/Row";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-primary px-5 pt-6">
      <Text className="text-white text-2xl font-semibold mb-6">
        Settings
      </Text>

      <Section title="Appearance">
        <Row label="Theme" value="System" />
      </Section>

      <Section title="Behavior">
        <Row label="Default Sort" value="Chronological" />
        <Row label="Confirm Deletes" />
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
