import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import uuid from "react-native-uuid";

import { List } from "../../../types/List";
import { loadLists, saveLists } from "../../../utils/storage";
import ListCard from "../../../components/lists/ListCard";
import { useListsStore } from "../../../store/useListStore";

export default function ListsScreen() {
  const [lists, setLists] = useState<List[]>([]);

const deleteList = useListsStore((s) => s.deleteList);


  useEffect(() => {
    (async () => {
      const stored = await loadLists();
      if (stored) setLists(stored);
    })();
  }, []);

  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  const createList = () => {
    const newList: List = {
      id: String(uuid.v4()),
      title: "New List",
      createdAt: Date.now(),
      items: [
        {
          id: String(uuid.v4()),
          title: "Sample Item", 
          completed: false,
          createdAt: Date.now(),
          order: 0,
        },
      ],
    };

    setLists((prev) => [...prev, newList]);
  };

  console.log("Rendering ListsScreen with lists:", lists);

  return (
    <View className="flex-1 bg-primary p-5">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Text className="text-white text-lg font-semibold flex-1">
          My Lists
        </Text>

        <Pressable onPress={createList}>
          <Text className="text-blue-400 text-base">+ New</Text>
        </Pressable>
      </View>

      {/* Lists */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListCard
            list={item}
            onPress={() => router.push(`/lists/${item.id}`)}
            onDelete={() => deleteList(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-20">
            No lists yet
          </Text>
        }
      />
    </View>
  );
}
