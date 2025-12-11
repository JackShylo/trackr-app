import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Todo } from "../types/Todo";

interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}

export default function ToDoItem({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.text);

  // Sync local value when parent updates the todo
  useEffect(() => {
    setValue(item.text);
  }, [item.text]);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-3 bg-white rounded-lg mb-2 shadow"
      onPress={() => onToggle(item.id)}   // <-- FIXED TOGGLE
      onLongPress={() => setEditing(true)}
    >
      {/* Text / Edit */}
      <View className="flex-1">
        {editing ? (
          <TextInput
            className="border p-1 rounded"
            value={value}
            onChangeText={setValue}
            onBlur={() => {
              if (value !== item.text) onUpdate(item.id, value);
              setEditing(false);
            }}
            autoFocus
          />
        ) : (
          <Text className={`text-lg ${item.completed ? "line-through text-gray-400" : ""}`}>
            {item.text}
          </Text>
        )}
      </View>

      {/* Delete */}
      <Pressable onPress={() => onDelete(item.id)} className="p-2">
        <Text className="text-red-500 font-bold">Delete</Text>
      </Pressable>
    </TouchableOpacity>
  );
}
