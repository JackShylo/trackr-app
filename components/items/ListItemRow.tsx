import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, Animated, PanResponder, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "../../types/ListItem";
import UpdateItemModal from "./UpdateItemModal";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

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

  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

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
      // Be more strict: require significant horizontal movement and minimal vertical movement
      const isHorizontalSwipe =
        Math.abs(gesture.dx) > SWIPE_ACTIVATION_DISTANCE &&
        Math.abs(gesture.dy) < VERTICAL_SWIPE_LIMIT &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5; // 1.5x more horizontal than vertical
      return isHorizontalSwipe;
    },

    onPanResponderMove: (_, gesture) => {
      // Only move if it's a clear horizontal swipe
      if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
        const clampedDx = Math.max(-160, Math.min(160, gesture.dx));
        translateX.setValue(clampedDx);
      }
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
      <View className="absolute inset-y-0 left-0 w-1/2 m-1 justify-center items-start pl-5 rounded-2xl" style={{ backgroundColor: themeConfig.primaryLight }}>
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
      <View className="absolute inset-y-0 right-0 w-1/2 m-1 justify-center items-end pr-5 rounded-2xl" style={{ backgroundColor: "#ef4444" }}>
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
        style={[{ transform: [{ translateX }] }, { backgroundColor: themeConfig.surface }]}
        className="flex-1 rounded-2xl"
      >
        <Pressable
          onLongPress={() => setEditVisible(true)}
          className="p-4"
        >
          <View className="flex-row items-start gap-3">
            <View className="flex-1">
              <Text className="font-medium" style={[{ color: themeConfig.text }, item.completed && { textDecorationLine: "line-through", color: themeConfig.textSecondary }]}>
                {item.title}
              </Text>
              
              {/* Badge row: priority + category + due date */}
              {(item.priority || item.category || item.dueDate) && (
                <View className="flex-row gap-2 mt-2 flex-wrap">
                  {item.priority && (
                    <View className="px-2 py-1 rounded" style={{ backgroundColor: item.priority === "high" ? "#fca5a5" : item.priority === "medium" ? "#fecaca" : "#fef3c7" }}>
                      <Text className="text-xs font-semibold" style={{ color: item.priority === "high" ? "#991b1b" : item.priority === "medium" ? "#b91c1c" : "#92400e" }}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Text>
                    </View>
                  )}
                  
                  {item.category && (
                    <View className="px-2 py-1 rounded" style={{ backgroundColor: themeConfig.primaryLight }}>
                      <Text className="text-xs font-semibold" style={{ color: themeConfig.primary }}>
                        {item.category}
                      </Text>
                    </View>
                  )}
                  
                  {item.dueDate && (
                    <View className="px-2 py-1 rounded" style={{ backgroundColor: new Date(item.dueDate) < new Date() ? "#fecaca" : themeConfig.primaryLight }}>
                      <Text className="text-xs font-semibold" style={{ color: new Date(item.dueDate) < new Date() ? "#b91c1c" : themeConfig.primary }}>
                        {new Date(item.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              {/* Notes preview */}
              {item.notes && (
                <Text className="text-xs mt-2" style={{ color: themeConfig.textSecondary }}>
                  {item.notes.substring(0, 60)}{item.notes.length > 60 ? "..." : ""}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
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
  card: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
