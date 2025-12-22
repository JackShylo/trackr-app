import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView, Alert, Platform } from "react-native";
import CreateListModal from "@/components/lists/CreateListModal";
import ListCard from "@/components/lists/ListCard";
import ListActionsSheet from "@/components/lists/ListActionsSheet";
import UpdateListModal from "@/components/lists/UpdateListModal";
import { useListsStore } from "@/store/useListStore";
import { List } from "@/types/List";


export default function ListsScreen() {
  useEffect(() => {
    if (!useListsStore.getState().hydrated) {
    useListsStore.getState().hydrate();
    }
  }, []);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

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
              onOpenMenu={() => {
                setSelectedList(lists.find((l) => l.id === item.id) || null);
                setSheetOpen(true);
              }}
            />
            <ListActionsSheet
              visible={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onRename={() => {
                setSheetOpen(false);
                setEditVisible(true);
              }}
              onDelete={() => {
                const message = "Are you sure you want to delete this list?";
                if (Platform.OS === "web") {
                  if (window.confirm(message)) {
                    console.log(item.id)
                    deleteList(selectedList!.id);
                  }
                } else {
                    Alert.alert(
                    "Confirm",
                      message,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress() {deleteList(item.id)}}
                    ]
                  );
                }
                setSheetOpen(false);
              }}
            />
            <UpdateListModal
              visible={editVisible}
              onClose={() => setEditVisible(false)}
              onSave={(title) => {
                if (selectedList) {
                  useListsStore.getState().updateList(selectedList.id, title);
                }
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
      className="absolute left-0 right-0 bottom-2 m-auto w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg z-999"
    >
      <Text className="relative -top-1 left-0 bottom-1 right-0 m-auto text-white text-4xl">+</Text>
    </Pressable>

    <CreateListModal
      visible={addOpen}
      onClose={() => setAddOpen(false)}
      onSubmit={(title) => addList(title)}
    />
  </>
  );
}
