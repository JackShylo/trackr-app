import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import ListItemRow from "../../../components/items/ListItemRow";
import CreateItemModal from "../../../components/items/CreateItemModal";
import SortOrderDropdown from "../../../components/ui/SortOrderDropdown";
import { useListsStore } from "../../../store/useListStore";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { sortItems } from "../../../utils/sorting";
import { THEMES } from "../../../constants/themes";

export default function ListDetailScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [addOpen, setAddOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const hydrate = useListsStore((s) => s.hydrate);
  const hydrated = useListsStore((s) => s.hydrated);

  const list = useListsStore((s) =>
    s.lists.find((l) => l.id === listId)
  );

  const addItem = useListsStore((s) => s.addItem);
  const updateItem = useListsStore((s) => s.updateItem);
  const deleteItem = useListsStore((s) => s.deleteItem);
  const toggleItem = useListsStore((s) => s.toggleItem);

  const itemSortMode = useSettingsStore((s) => s.itemSortMode);
  const setItemSortMode = useSettingsStore((s) => s.setItemSortMode);
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  /* ─────────── Hydrate once ─────────── */
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!useSettingsStore.getState().hydrated) {
      useSettingsStore.getState().hydrate();
    }
  }, []);

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

  const sortedItems = sortItems(list.items, itemSortMode);

  return (
    <>
      <Stack.Screen
        options={{
          title: list.title,
        }}
      />

    <View className="flex-1 min-h-full" style={{ backgroundColor: themeConfig.background }}>
      {/* Header */}
      <View className="flex-row items-center p-4 gap-3 z-10" style={{ backgroundColor: themeConfig.primary }}>
        <Text className="text-lg font-semibold flex-1 ml-2" style={{ color: themeConfig.text }}>
          {list.title}
        </Text>
        <SortOrderDropdown
          value={itemSortMode}
          onChange={(mode) => setItemSortMode(mode)}
          open={sortDropdownOpen}
          onToggle={() => setSortDropdownOpen(!sortDropdownOpen)}
          onClose={() => setSortDropdownOpen(false)}
        />
      </View>
      
      <FlatList
        className="flex-1 p-4 min-h-[400px]"
        data={sortedItems}
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
    </View>

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
      onSubmit={(text) => addItem(list.id, text, )}
      />
    </>
  );
}
