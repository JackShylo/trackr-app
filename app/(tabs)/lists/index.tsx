import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import CreateListModal from "@/components/lists/CreateListModal";
import ListCard from "@/components/lists/ListCard";
import { useListsStore } from "@/store/useListStore";
import { List } from "@/types/List";
import ListActionsSheet from "@/components/lists/ListActionsSheet";

export default function ListsScreen() {
  useEffect(() => {
    if (!useListsStore.getState().hydrated) {
    useListsStore.getState().hydrate();
    }
  }, []);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const lists = useListsStore((s) => s.lists);
  const deleteList = useListsStore((s) => s.deleteList);
  const addList = useListsStore((s) => s.addList);

  return (
    <>
    <ScrollView className="flex-1 bg-primary p-5 min-h-full">
      {/* Header */}
      <View className="flex-row mb-4">
        <Text className="text-white text-lg font-semibold flex-1">
          My Lists
        </Text>
      </View>

      {/* Lists */}
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
            <ListCard
              list={item}
              onPress={() => router.push(`/lists/${item.id}`)}
              onDelete={() => deleteList(item.id)}
              onOpenMenu={() => {
                setSelectedList(lists.find((l) => l.id === item.id) || null);
                setSheetOpen(true);
              }}
            />
            <ListActionsSheet
              list={selectedList}
              visible={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onRename={() => {
                setSheetOpen(false);
                // open rename modal
              }}
              onDelete={() => {
                setSheetOpen(false);
                deleteList(selectedList!.id);
              }}
            />
            </>
          )}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-20">
              No lists yet
            </Text>
          }
        />
    </ScrollView>

    {/* Floating Add Button */}
    <Pressable
      onPress={() => setAddOpen(true)}
      className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
    >
      <Text className="text-white text-3xl leading-none">+</Text>
    </Pressable>

    <CreateListModal
      visible={addOpen}
      onClose={() => setAddOpen(false)}
      onSubmit={(title) => addList(title)}
    />
  </>
  );
}
