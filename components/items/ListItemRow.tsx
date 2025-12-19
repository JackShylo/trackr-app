import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, Animated, PanResponder, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "../../types/ListItem";
import UpdateItemModal from "./UpdateItemModal";

interface Props {
  item: ListItem;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (
    id: string,
    updates: Partial<Pick<ListItem, "title" | "notes" | "category">>
  ) => void;
}

export default function ListItemRow({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState(item.title);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [category, setCategory] = useState(item.category ?? "");
  const notesRef = useRef<TextInput>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const [editVisible, setEditVisible] = useState(false);

  const SWIPE_ACTIVATION_DISTANCE = 20;
  const VERTICAL_SWIPE_LIMIT = 15;
  const editThreshold = 120;
  const deleteThreshold = -120;

  useEffect(() => {
    setText(item.title);
    setNotes(item.notes ?? "");
    setCategory(item.category ?? "");
  }, [item.title, item.notes, item.category]);

  {/* Interpolations for icons */}
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
    onUpdate!(item.id, { title: text.trim(), notes: notes.trim(), category: category.trim() });

    setEditing(false);
  };



  {/* PanResponder for swipe gestures */}
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
      }).start(() => onDelete!(item.id));
      return;
    }

  if (gesture.dx > editThreshold) {
    // ENTER EDIT MODE IMMEDIATELY
    onToggle!(item.id);

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
      <View className="absolute left-0 top-0 bottom-0 bg-green-500 justify-center items-start pl-5 w-1/2">
        <Animated.View
          style={{
            opacity: editIconOpacity,
            transform: [{ translateX: editIconTranslate }],
          }}
        >
          <Ionicons name="checkmark-outline" size={26} color="white" />
        </Animated.View>
      </View>

      {/* Delete background */}
      <View className="absolute right-0 top-0 bottom-0 bg-red-500 justify-center items-end pr-5 w-1/2">
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
          { transform: [{ translateX }] },
          styles.card
        ]}
        className="p-4 flex-row items-center"
      >
        <Pressable
          className="flex-1 min-h-100 min-w-100 justify-center px-4"
          onLongPress={() => !editing && setEditVisible(true)}
        >
          <Text className="font-medium" style={[item.completed && styles.completed]}>
            {item.title}
          </Text>
        </Pressable>

        {/*
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
            onPress={() => setExpanded((v) => !v)}
            className="absolute right-4"
          />
        */}
      </Animated.View>

      <UpdateItemModal
        visible={editVisible}
        list={item}
        onClose={() => setEditVisible(false)}
        onSave={onUpdate!}
      />
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
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    height: "100%",
    zIndex: 1
  },
  itemTitle: {
    fontSize: 16,
    color: "#111827",
  },
  input: {
    fontSize: 16,
    paddingVertical: 8
  },
  editBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#48bb78",
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
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    width: "50%"
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
  notes: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  notesText: {
    color: "#4B5563",
    lineHeight: 20,
  }
});
