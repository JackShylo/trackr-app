import { useMemo, useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import uuid from "react-native-uuid";
import TodoItem from "../../components/todo/ToDoItem";
import AddTodoModal from "../../components/todo/AddToDoModal";
import SortDropdown from "../../components/todo/SortOrderDropdown";
import { Todo } from "../../types/Todo";
import { sortAlphabetical, sortChronological, sortCustom } from "../../utils/sorting";
import { dummy } from "../../scripts/fodderToDos";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortMode, setSortMode] = useState<"custom" | "alpha" | "chrono">("chrono");
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
  // Only generate if list is empty
  /*if (todos.length === 0) {
    const dummy = Array.from({ length: 5 }).map((_, idx) => ({
      id: String(uuid.v4()),
      text: `Sample Task ${idx + 1}`,
      createdAt: Date.now() - idx * 5000,
      completed: false,
      order: idx,
    }));
    */
    setTodos(dummy);
}, []);

  const addTodo = (text: string, category?: string) => {
    const newTodo: Todo = {
      id: String(uuid.v4()),
      text,
      category: category ? category : undefined,
      createdAt: Date.now(),
      completed: false,
      order: todos.length,
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const updateTodo = (id: string, newText: string, notes?: string, category?: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: newText, notes, category } : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) =>
      prev
        .filter((t) => t.id !== id)
        .map((t, i) => ({ ...t, order: i }))
    );
  };

  const sorted = useMemo(() => {
    if (sortMode === "alpha") return sortAlphabetical(todos);
    if (sortMode === "chrono") return sortChronological(todos);
    return sortCustom(todos);
  }, [todos, sortMode]);

  const groupedTodos = useMemo(() => {
  const groups: Record<string, Todo[]> = {};

  for (const todo of sorted) {
    const key = todo.category?.trim() || "Uncategorized";
    if (!groups[key]) groups[key] = [];
    groups[key].push(todo);
  }

  return groups;
}, [sorted]);

  return (
    <ScrollView className="bg-primary flex-1 p-5">
      {/* HEADER */}
      <View className="flex-row mb-4">
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">To-Do List</Text>
        </View>
      </View>

      {Object.entries(groupedTodos).map(([category, items]) => (
        <View key={category} className="border border-gray-800 rounded-xl px-2 pt-2 mt-4 relative">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-2 absolute -top-3 bg-primary px-2">
            {category}
          </Text>

          {items.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </View>
      ))}

      {/* LIST */}
      {/*<FlatList
        style={{ zIndex: -1 }}
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}
      />*/}

      <View className="absolute top-5 right-5 z-10">
        <SortDropdown
          value={sortMode}
          open={sortOpen}
          onToggle={() => setSortOpen(v => !v)}
          onClose={() => setSortOpen(false)}
          onChange={(mode) => {
            setSortMode(mode);
            setSortOpen(false);
          }}
        />
      </View>

      {/* FLOATING ADD BUTTON */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="w-12 h-12 bg-blue-500 p-4 absolute bottom-8 right-8 rounded-full shadow-lg items-center justify-center"
      >
        <Text className="text-white text-3xl bottom-0.5">+</Text>
      </Pressable>

      {/* ADD TODOMODAL */}
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addTodo}
      />
    </ScrollView>
  );
}