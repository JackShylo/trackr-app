import { useEffect, useState } from "react";
import { View } from "react-native";
import { List } from "../../types/List";
import { loadLists } from "../../utils/storage";

export default function ListsIndex() {
  const [lists, setLists] = useState<List[]>([]);

  // Load lists on app start
  useEffect(() => {
    loadLists().then((stored) => {
      if (stored) setLists(stored);
    });
  }, []);

  return (
    <View className="flex-1 bg-primary px-5 pt-6">
    </View>
  );
}
