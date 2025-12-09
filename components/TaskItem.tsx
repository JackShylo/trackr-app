import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { Todo } from "../types/Task";

interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.text);

  return (
    <View className="flex-row items-center justify-between p-3 bg-white rounded-lg mb-2 shadow">

      {/* Left side */}
      <Pressable className="flex-1" onLongPress={() => setEditing(true)}>
        {editing ? (
          <TextInput
            className="border p-1 rounded"
            value={value}
            onChangeText={setValue}
            onBlur={() => {
              onUpdate(item.id, value);
              setEditing(false);
            }}
            autoFocus
          />
        ) : (
          <Text
            className={`text-lg ${item.completed ? "line-through text-gray-400" : ""}`}
          >
            {item.text}
          </Text>
        )}
      </Pressable>

      {/* Right side buttons */}
      <Pressable onPress={() => onDelete(item.id)}>
        <Text className="text-red-500 font-bold ml-3">Delete</Text>
      </Pressable>
    </View>
  );
}
