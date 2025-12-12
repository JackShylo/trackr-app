import { View, Text, TextInput, Pressable, Animated, PanResponder } from "react-native";
import { useState, useEffect, useRef } from "react";
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

  const translateX = useRef(new Animated.Value(0)).current;
  const deleteThreshold = -120;

  useEffect(() => {
    setValue(item.text);
  }, [item.text]);

  // --- Swipe Gesture ---
  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dx) > 10 && !editing,

    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) {
        translateX.setValue(gesture.dx); // only allow left swipe
      }
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < deleteThreshold) {
        // auto delete if swiped far enough
        Animated.timing(translateX, {
          toValue: -300,
          duration: 150,
          useNativeDriver: true,
        }).start(() => onDelete(item.id));
      } else {
        // snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <View className="mb-2">
      {/* Delete background */}
      <View className="absolute right-0 top-0 bottom-0 bg-red-500 rounded-lg justify-center pr-5">
        <Text className="text-white font-bold">Delete</Text>
      </View>

      {/* Foreground swipeable card */}
      <Animated.View
        {...pan.panHandlers}
        style={{
          transform: [{ translateX }],
        }}
        className="p-3 bg-white rounded-lg shadow flex-row items-center"
      >
        <Pressable
          className="flex-1"
          onPress={() => !editing && onToggle(item.id)}
          onLongPress={() => setEditing(true)}
        >
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
            <Text
              className={`text-lg ${
                item.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {item.text}
            </Text>
          )}
        </Pressable>

        {/* Manual delete button (still works) */}
        <Pressable onPress={() => onDelete(item.id)} className="p-2">
          <Text className="text-red-500 font-bold">X</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
