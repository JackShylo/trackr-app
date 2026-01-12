import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, notes?: string, category?: string, priority?: "low" | "medium" | "high", dueDate?: number) => void;
}

export default function CreateItemModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<string>("");

  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  const handleAdd = () => {
    if (title.trim()) {
      const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
      onSubmit(
        title.trim(),
        "",
        notes.trim() || undefined,
        category.trim().toLowerCase() || undefined,
        priority,
        dueDateTimestamp
      );
      setTitle("");
      setNotes("");
      setCategory("");
      setPriority("medium");
      setDueDate("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setNotes("");
    setCategory("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="absolute inset-0 bg-black bg-opacity-40"/>
      </TouchableWithoutFeedback>

      {/* CARD */}
      <View className="absolute top-1/4 left-0 right-0 items-center max-h-1/2">
        <View className="w-4/5 rounded-xl p-5 shadow-lg" style={{ backgroundColor: themeConfig.surface }}>
          <Text className="text-lg font-semibold mb-4" style={{ color: themeConfig.text }}>Add Task</Text>
          
          <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
            <TextInput
              className="p-3 rounded-lg mb-3"
              placeholder="Task title"
              placeholderTextColor={themeConfig.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={{ backgroundColor: themeConfig.background, color: themeConfig.text }}
              autoFocus
            />
            
            <TextInput
              className="p-3 rounded-lg mb-3"
              placeholder="Notes (optional)"
              placeholderTextColor={themeConfig.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
              style={{ backgroundColor: themeConfig.background, color: themeConfig.text }}
            />
            
            <TextInput
              className="p-3 rounded-lg mb-3"
              placeholder="Category (optional)"
              placeholderTextColor={themeConfig.textSecondary}
              value={category}
              onChangeText={setCategory}
              style={{ backgroundColor: themeConfig.background, color: themeConfig.text }}
            />
            
            <TextInput
              className="p-3 rounded-lg mb-3"
              placeholder="Due date (YYYY-MM-DD)"
              placeholderTextColor={themeConfig.textSecondary}
              value={dueDate}
              onChangeText={setDueDate}
              style={{ backgroundColor: themeConfig.background, color: themeConfig.text }}
            />

            <View className="mb-3">
              <Text className="mb-2 text-sm font-semibold" style={{ color: themeConfig.text }}>Priority</Text>
              <View className="flex-row gap-2">
                {["low", "medium", "high"].map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p as "low" | "medium" | "high")}
                    className="flex-1 py-2 rounded-lg"
                    style={{
                      backgroundColor: priority === p ? themeConfig.primary : themeConfig.background,
                    }}
                  >
                    <Text
                      className="text-center font-medium text-xs capitalize"
                      style={{ color: priority === p ? "white" : themeConfig.text }}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="flex-row justify-end gap-2 mt-4">
            <Pressable className="px-4 py-2 rounded-lg" style={{ backgroundColor: themeConfig.primary }} onPress={handleAdd}>
              <Text className="font-semibold text-white">Add</Text>
            </Pressable>
            <Pressable className="px-4 py-2 rounded-lg" style={{ backgroundColor: "#ef4444" }} onPress={handleClose}>
              <Text className="font-semibold text-white">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}