import { View, Text, TextInput, Pressable, Animated, PanResponder, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Todo } from "../../types/Todo";

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
    <View style={styles.container}>
      {/* Delete background */}
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>

      {/* Foreground swipeable card */}
      <Animated.View
        {...pan.panHandlers}
        style={[
          { transform: [{ translateX }], zIndex: 1 },
          styles.card,
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => !editing && onToggle(item.id)}
          onLongPress={() => setEditing(true)}
        >
          {editing ? (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              onBlur={() => {
                if (value !== item.text) onUpdate(item.id, value);
                setEditing(false);
              }}
              autoFocus
            />
          ) : (
            <Text style={[styles.text, item.completed && styles.completed]}>
              {item.text}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 10,
    minHeight: 60,
    borderRadius: 12,
    overflow: "hidden", // ensures delete bg respects rounded corners
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#EF4444", // red-500
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    height: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 8,
    borderRadius: 6,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#111827",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
});
