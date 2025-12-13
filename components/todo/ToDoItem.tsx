import { View, Text, TextInput, Pressable, Animated, PanResponder, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Todo } from "../../types/Todo";
import { Ionicons } from "@expo/vector-icons";


interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, notes?: string) => void;
}

export default function ToDoItem({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.text);
  const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState(item.text);
  const [notes, setNotes] = useState(item.notes ?? "");

    const titleRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const iconOpacity = translateX.interpolate({
  inputRange: [-120, -40, 0],
  outputRange: [1, 0.5, 0],
  extrapolate: "clamp",
});

const iconTranslate = translateX.interpolate({
  inputRange: [-120, 0],
  outputRange: [0, 20],
  extrapolate: "clamp",
});

const editIconOpacity = translateX.interpolate({
  inputRange: [0, 40, 120],
  outputRange: [0, 0.5, 1],
  extrapolate: "clamp",
});

const editIconTranslate = translateX.interpolate({
  inputRange: [0, 120],
  outputRange: [-20, 0],
  extrapolate: "clamp",
});

  const save = () => {
    onUpdate(item.id, text.trim(), notes.trim());
    setEditing(false);
  }; 
const SWIPE_ACTIVATION_DISTANCE = 20;
const VERTICAL_SWIPE_LIMIT = 15;

const editThreshold = 120;

  const deleteThreshold = -120;

  useEffect(() => {
    setValue(item.text);
  }, [item.text]);

  // --- Swipe Gesture ---
  const pan = PanResponder.create({
onMoveShouldSetPanResponder: (_, gesture) => {
  if (editing) return false;

  const isHorizontalSwipe =
    Math.abs(gesture.dx) > SWIPE_ACTIVATION_DISTANCE &&
    Math.abs(gesture.dy) < VERTICAL_SWIPE_LIMIT;

  return isHorizontalSwipe;
},

onPanResponderMove: (_, gesture) => {
  const clampedDx = Math.max(-160, Math.min(160, gesture.dx));
  translateX.setValue(clampedDx);
},


onPanResponderRelease: (_, gesture) => {
  if (gesture.dx < deleteThreshold) {
    // DELETE
    Animated.timing(translateX, {
      toValue: -300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => onDelete(item.id));
    return;
  }

if (gesture.dx > editThreshold) {
  // ENTER EDIT MODE IMMEDIATELY
  setEditing(true);
  
  Animated.spring(translateX, {
    toValue: 0,
    useNativeDriver: true,
  }).start();

  return;
}



  // SNAP BACK
  Animated.spring(translateX, {
    toValue: 0,
    useNativeDriver: true,
  }).start();
},

  });

  return (
    <View style={styles.container}>

    {/* Edit background */}
<View style={styles.editBackground}>
  <Animated.View
    style={{
      opacity: editIconOpacity,
      transform: [{ translateX: editIconTranslate }],
    }}
  >
    <Ionicons name="pencil-outline" size={26} color="white" />
  </Animated.View>
</View>

      {/* Delete background */}
      <View style={styles.deleteBackground}>
        <Animated.View
          style={{
            opacity: iconOpacity,
            transform: [{ translateX: iconTranslate }],
          }}
        >
          <Ionicons name="trash-outline" size={28} color="white" />
        </Animated.View>
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
          onLongPress={() => !editing && onToggle(item.id)}
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

        {/* Expanded section */}
        {expanded && (
          <View style={styles.expand}>
            {editing ? (
              <>
                <TextInput
                  ref={titleRef}
                  style={styles.input}
                  value={item.text}
                  onChangeText={setText}
                  placeholder="Task title"
                  returnKeyType="next"
                  autoFocus
                  onSubmitEditing={() => notesRef.current?.focus()}
                />

                <TextInput
                  ref={notesRef}
                  style={[styles.input, styles.notes]}
                  value={item.notes}
                  onChangeText={setNotes}
                  placeholder="Notes (optional)"
                  multiline
                  blurOnSubmit
                  onBlur={save}
                />
              </>
            ) : (
              <>
                {!!item.notes && (
                  <Text style={styles.notesText}>{item.notes}</Text>
                )}

                <Pressable
                  style={styles.editBtn}
                  onPress={() => setEditing(true)}
                >
                  <Ionicons name="pencil-outline" size={16} />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
          
        </Pressable>
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
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
  editBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#3B82F6", // blue-500
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    width: "50%"
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
    width: "50%"
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
  expand: {
    marginTop: 10,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  notes: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  notesText: {
    color: "#4B5563",
    lineHeight: 20,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  editText: {
    color: "#2563EB",
    fontWeight: "500",
  },
});
