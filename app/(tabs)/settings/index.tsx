import React, { ReactNode } from "react";
import { View, Text, Pressable, ScrollView, Alert, Platform, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Section from "@/components/settings/Section"
import Row from "@/components/settings/Row";
import ThemePicker from "@/components/settings/ThemePicker";
import SortPicker from "@/components/settings/SortPicker";
import Toggle from "@/components/settings/Toggle";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useListsStore } from "@/store/useListStore";
import { THEMES } from "@/constants/themes";
import { saveLists } from "@/utils/storage";

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];
  const confirmDeletes = useSettingsStore((s) => s.confirmDeletes);
  const setConfirmDeletes = useSettingsStore((s) => s.setConfirmDeletes);
  const lists = useListsStore((s) => s.lists);
  const lastAction = useListsStore((s) => s.lastAction);
  const undo = useListsStore((s) => s.undo);

  const handleExportData = async () => {
    const dataToExport = {
      lists,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);

    if (Platform.OS === "web") {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonString));
      element.setAttribute("download", `trackr-export-${Date.now()}.json`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      try {
        await Share.share({
          message: jsonString,
          title: "Trackr Data Export",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to export data");
      }
    }
  };

  const handleDeleteAllData = () => {
    const handleDelete = async () => {
      useListsStore.setState({ lists: [] });
      await saveLists([]);
    };

    const message = "Are you sure you want to delete all lists and items? This cannot be undone.";
    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        handleDelete();
      }
    } else {
      Alert.alert(
        "Confirm",
        message,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete All", style: "destructive", onPress: handleDelete }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeConfig.background }}>
      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-semibold mb-6" style={{ color: themeConfig.text }}>
          Settings
        </Text>

        <Section title="Appearance">
          <View className="px-4 py-3">
            <Text className="text-sm mb-3" style={{ color: themeConfig.textSecondary }}>Theme</Text>
            <ThemePicker />
          </View>
        </Section>

        <Section title="Behavior">
          <SortPicker />
          <View style={{ borderTopColor: themeConfig.textSecondary, borderTopWidth: 1 }} />
          <Toggle 
            label="Confirm Deletes" 
            value={confirmDeletes}
            onChange={setConfirmDeletes}
          />
        </Section>

        <Section title="Data">
          <Row label="Export Data" onPress={handleExportData} />
          {lastAction && (
            <Row 
              label={`Undo ${lastAction.type === "deleteList" ? "delete list" : lastAction.type === "deleteItem" ? "delete item" : lastAction.type === "addItem" ? "add item" : lastAction.type === "togglePin" ? "pin" : "action"}`}
              onPress={async () => {
                await undo();
                // Force a re-render by subscribing to state again
                useListsStore.setState({ lastAction: undefined });
              }}
            />
          )}
          <Row label="Delete All Data" danger onPress={handleDeleteAllData} />
        </Section>

        <Section title="About">
          <Row label="Version" value="1.0.0" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
