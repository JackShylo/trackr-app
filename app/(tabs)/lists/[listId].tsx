import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import ListItemRow from "../../../components/items/ListItemRow";
import CreateItemModal from "../../../components/items/CreateItemModal";
import { useListsStore } from "../../../store/useListStore";

export default function ListDetailScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [addOpen, setAddOpen] = useState(false);

  const hydrate = useListsStore((s) => s.hydrate);
  const hydrated = useListsStore((s) => s.hydrated);

  const list = useListsStore((s) =>
    s.lists.find((l) => l.id === listId)
  );

  const addItem = useListsStore((s) => s.addItem);
  const updateItem = useListsStore((s) => s.updateItem);
  const deleteItem = useListsStore((s) => s.deleteItem);
  const toggleItem = useListsStore((s) => s.toggleItem);

  /* ─────────── Hydrate once ─────────── */
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <View>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!list) {
    return (
      <View>
        <Text>List not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: list.title,
        }}
      />

    <ScrollView className="flex-1 bg-primary p-5 min-h-full">
      {/* Header */}
      <View className="flex-row mb-4">
        <Text className="text-white text-lg font-semibold flex-1 ml-2">
          {list.title}
        </Text>
      </View>
      
      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItemRow
            item={item}
            onToggle={(id) => toggleItem(list.id, id)}
            onDelete={(id) => deleteItem(list.id, id)}
            onUpdate={(id, updates) => updateItem(list.id, id, updates)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </ScrollView>

    {/* Floating Add Button */}
    <Pressable
      onPress={() => setAddOpen(true)}
      className="absolute left-0 right-0 bottom-2 m-auto w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg z-999"
    >
      <Text className="relative -top-1 left-0 bottom-1 right-0 m-auto text-white text-4xl">+</Text>
    </Pressable>
    <CreateItemModal
      visible={addOpen}
      onClose={() => setAddOpen(false)}
      onSubmit={(text) => addItem(list.id, text)}
      />
    </>
  );
}
