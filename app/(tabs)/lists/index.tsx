import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView, Alert, Platform, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CreateListModal from "@/components/lists/CreateListModal";
import ListCard from "@/components/lists/ListCard";
import ListActionsSheet from "@/components/lists/ListActionsSheet";
import UpdateListModal from "@/components/lists/UpdateListModal";
import SortOrderDropdown from "@/components/ui/SortOrderDropdown";
import { useListsStore } from "@/store/useListStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { List } from "@/types/List";
import { MAX_LISTS } from "@/constants/limits";
import { sortLists } from "@/utils/sorting";
import { THEMES } from "@/constants/themes";


export default function ListsScreen() {
  useEffect(() => {
    if (!useListsStore.getState().hydrated) {
    useListsStore.getState().hydrate();
    }
    if (!useSettingsStore.getState().hydrated) {
    useSettingsStore.getState().hydrate();
    }
  }, []);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const lists = useListsStore((s) => s.lists);
  const deleteList = useListsStore((s) => s.deleteList);
  const cloneList = useListsStore((s) => s.cloneList);
  const togglePinList = useListsStore((s) => s.togglePinList);
  const undo = useListsStore((s) => s.undo);
  const addList = useListsStore((s) => s.addList);
  
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];
  const listSortMode = useSettingsStore((s) => s.listSortMode);
  const setListSortMode = useSettingsStore((s) => s.setListSortMode);
  const confirmDeletes = useSettingsStore((s) => s.confirmDeletes);

  const sortedLists = sortLists(lists, listSortMode);

  // Filter lists by search text
  const filteredLists = searchText.trim()
    ? sortedLists.filter((list) =>
        list.title.toLowerCase().includes(searchText.toLowerCase()) ||
        list.items.some((item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.notes?.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : sortedLists;

  return (
    <>
    <SafeAreaView className="flex-1 min-h-full" style={{ backgroundColor: themeConfig.background }}>
      {/* Header */}
      <View className="p-4 gap-3 z-10" style={{ backgroundColor: themeConfig.primary }}>
        <View className="flex-row items-center gap-3">
          <Text className="text-lg font-semibold flex-1" style={{ color: themeConfig.text }}>
            My Lists
          </Text>
          <SortOrderDropdown
            value={listSortMode}
            onChange={(mode) => setListSortMode(mode)}
            open={sortDropdownOpen}
            onToggle={() => setSortDropdownOpen(!sortDropdownOpen)}
            onClose={() => setSortDropdownOpen(false)}
          />
        </View>
        
        {/* Search Bar */}
        <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: themeConfig.surface }}>
          <Ionicons name="search" size={18} color={themeConfig.textSecondary} />
          <TextInput
            className="flex-1"
            placeholder="Search lists or items..."
            placeholderTextColor={themeConfig.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            style={{ color: themeConfig.text }}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color={themeConfig.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Lists */}
        <FlatList
          className="flex-1 p-4"
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
            <ListCard
              list={item}
              onPress={() => router.push(`/lists/${item.id}`)}
              onLongPress={() => {
                setSelectedList(sortedLists.find((l) => l.id === item.id) || null);
                setSheetOpen(true);
              }}
              onOpenMenu={() => {
                setSelectedList(sortedLists.find((l) => l.id === item.id) || null);
                setSheetOpen(true);
              }}
            />
            <ListActionsSheet
              visible={sheetOpen}
              onClose={() => setSheetOpen(false)}
              isPinned={selectedList?.pinned}
              onRename={() => {
                setSheetOpen(false);
                setEditVisible(true);
              }}
              onClone={() => {
                if (selectedList && lists.length < MAX_LISTS) {
                  cloneList(selectedList.id);
                  setSheetOpen(false);
                } else if (lists.length >= MAX_LISTS) {
                  Alert.alert("Limit Reached", `You can only have up to ${MAX_LISTS} lists.`);
                }
              }}
              onPin={() => {
                if (selectedList) {
                  togglePinList(selectedList.id);
                  setSheetOpen(false);
                }
              }}
              onDelete={() => {
                const handleDelete = () => {
                  deleteList(selectedList!.id);
                  setSheetOpen(false);
                };

                if (!confirmDeletes) {
                  handleDelete();
                  return;
                }

                const message = "Are you sure you want to delete this list?";
                if (Platform.OS === "web") {
                  if (window.confirm(message)) {
                    handleDelete();
                  }
                } else {
                  Alert.alert(
                    "Confirm",
                    message,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: handleDelete }
                    ]
                  );
                }
              }}
            />
            <UpdateListModal
              initialTitle={selectedList?.title}
              initialIcon={selectedList?.icon}
              visible={editVisible}
              onClose={() => setEditVisible(false)}
              onSave={(title, icon) => {
                if (selectedList) {
                  useListsStore.getState().updateList(selectedList.id, title, icon);
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
    </SafeAreaView>

    {/* Floating Add Button */}
    <Pressable
      disabled={lists.length >= MAX_LISTS}
      onPress={() => setAddOpen(true)}
      className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg z-50"
      style={{
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
      }}
    >
      <Text className="text-white text-4xl font-bold">+</Text>
    </Pressable>

    <CreateListModal
      visible={addOpen}
      onClose={() => setAddOpen(false)}
      onSubmit={(title, icon) => addList(title, icon)}
    />
  </>
  );
}
