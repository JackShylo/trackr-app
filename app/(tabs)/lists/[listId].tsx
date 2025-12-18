import { View, Text, FlatList, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import uuid from "react-native-uuid";

import ListItemRow from "../../../components/items/ListItemRow";
import CreateItemModal from "../../../components/items/CreateItemModal";
import { useListsStore } from "../../../store/useListStore";
import { ListItem } from "../../../types/ListItem";

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
  const reorderItems = useListsStore((s) => s.reorderItems);


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

      <View className="flex-1 bg-primary p-4">
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

        {/* Floating Add Button */}
        <Pressable
          onPress={() => setAddOpen(true)}
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
        >
          <Text className="text-white text-3xl leading-none">+</Text>
        </Pressable>

        <CreateItemModal
          visible={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={(text) => addItem(list.id, text)}
        />
      </View>
    </>
  );
}
