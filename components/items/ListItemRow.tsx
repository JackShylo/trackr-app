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
    <View className="relative mb-4 overflow-hidden rounded-2xl">
    {/* Edit background */}
      <View className="absolute inset-y-0 left-0 w-1/2 bg-green-500 justify-center items-start pl-5">
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
      <View className="absolute inset-y-0 right-0 w-1/2 bg-red-500 justify-center items-end pr-5">
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
        style={[{ transform: [{ translateX }] }, styles.card]}
      >
        <Pressable
          onLongPress={() => setEditVisible(true)}
          className="p-5"
        >
          <Text className="font-medium text-white" style={[item.completed && styles.completed]}>
            {item.title}
          </Text>
        </Pressable>
      </Animated.View>
      
        {/*
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
            onPress={() => setExpanded((v) => !v)}
            className="absolute right-4"
          />
        */}

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
card: {
  flex: 1,
  borderRadius: 16,
  backgroundColor: "#1F2937",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
},
  completed: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  }
});
