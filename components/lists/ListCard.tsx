import { View, Text, Pressable, PanResponder, Animated, Alert, Platform, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { List } from "../../types/List";
import { useRef } from "react";

interface Props {
  list: List;
  onPress: () => void;
  onDelete?: () => void
  onLongPress?: () => void;
}


export default function ListCard({ list, onPress, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const SWIPE_ACTIVATION_DISTANCE = 20;
  const VERTICAL_SWIPE_LIMIT = 15;
  const deleteThreshold = -120;
  {/* PanResponder for swipe gestures */}
  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
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
      }).start(() => onDelete!());
      return;
    }

    // SNAP BACK
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  },
});


const confirmDelete = (event: GestureResponderEvent) => {
  const message = "Are you sure you want to delete this list?";
  if (Platform.OS === "web") {
    if (window.confirm(message)) onDelete!();
  } else {
    Alert.alert(
      "Confirm",
      message,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  }
}
  return (
    <Pressable
      onPress={onPress}
      onLongPress={confirmDelete}
      className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center"
    >
      {/* Icon / Color */}
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: list.color ?? "#2563EB" }}
      >
        <Ionicons name="list-outline" size={20} color="white" />
      </View>

      {/* Title */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">
          {list.title}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          {list.items.length} item{list.items.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" onPress={onPress} />
    </Pressable>
  );
}
