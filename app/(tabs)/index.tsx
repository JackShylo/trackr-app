import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold">Welcome</Text>
      <Text className="text-gray-600 mt-2">Navigate to the To-Dos tab</Text>
    </View>
  );
}
