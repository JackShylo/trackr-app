import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { ListItem } from "../../types/ListItem";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

interface Props {
  visible: boolean;
  list: ListItem | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<ListItem, "title" | "notes" | "category" | "priority" | "dueDate">>) => void;
}

export default function UpdateItemModal({ visible, list, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");

  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setNotes(list.notes || "");
      setCategory(list.category || "");
      setPriority(list.priority || "medium");
      setDueDate(list.dueDate ? new Date(list.dueDate).toISOString().split("T")[0] : "");
    }
  }, [list]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <KeyboardAvoidingView behavior="padding" className="w-full">
          <View className="rounded-2xl p-5 shadow-lg max-h-4/5" style={{ backgroundColor: themeConfig.surface }}>
            <Text className="text-lg font-semibold mb-4" style={{ color: themeConfig.text }}>Edit Item</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <TextInput
                className="border rounded-xl px-4 py-3 mb-3"
                style={{ backgroundColor: themeConfig.background, color: themeConfig.text, borderColor: themeConfig.textSecondary }}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor={themeConfig.textSecondary}
                autoFocus
              />
              {title.length === 0 && (
                  <Text className="text-red-500 text-sm mb-2">
                      Title cannot be empty
                  </Text>
              )}

              {/* Notes */}
              <TextInput
                className="border rounded-xl px-4 py-3 mb-3"
                style={{ backgroundColor: themeConfig.background, color: themeConfig.text, borderColor: themeConfig.textSecondary }}
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes (optional)"
                placeholderTextColor={themeConfig.textSecondary}
                multiline
                numberOfLines={2}
              />

              {/* Category */}
              <TextInput
                className="border rounded-xl px-4 py-3 mb-3"
                style={{ backgroundColor: themeConfig.background, color: themeConfig.text, borderColor: themeConfig.textSecondary }}
                value={category}
                onChangeText={setCategory}
                placeholder="Category (optional)"
                placeholderTextColor={themeConfig.textSecondary}
              />

              {/* Due Date */}
              <TextInput
                className="border rounded-xl px-4 py-3 mb-3"
                style={{ backgroundColor: themeConfig.background, color: themeConfig.text, borderColor: themeConfig.textSecondary }}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="Due date (YYYY-MM-DD)"
                placeholderTextColor={themeConfig.textSecondary}
              />

              {/* Priority */}
              <View className="mb-3">
                <Text className="text-sm font-semibold mb-2" style={{ color: themeConfig.text }}>Priority</Text>
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

            {/* Actions */}
            <View className="flex-row justify-end gap-2 mt-4">
              <Pressable
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: themeConfig.primary }}
                onPress={() => {
                  if (list) {
                    const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
                    onSave(
                      list.id,
                      { 
                        title: title.trim(), 
                        notes: notes.trim() || undefined,
                        category: category.trim() || undefined,
                        priority,
                        dueDate: dueDateTimestamp
                      }
                    );
                  }
                  onClose();
                }}
              >
                <Text className="font-semibold text-white">Save</Text>
              </Pressable>
              <Pressable className="px-4 py-2 rounded-lg" style={{ backgroundColor: "#ef4444" }} onPress={onClose}>
                <Text className="font-semibold text-white">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
