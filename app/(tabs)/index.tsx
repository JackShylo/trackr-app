import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import TodoItem from "../../components/todo/ToDoItem";
import AddTodoModal from "../../components/todo/AddToDoModal";
import SortDropdown from "../../components/todo/SortOrderDropdown";
import { Todo } from "../../types/Todo";
import uuid from "react-native-uuid";
import {
  sortAlphabetical,
  sortChronological,
  sortCustom,
} from "../../utils/sorting";
import { useEffect } from "react";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortMode, setSortMode] =
    useState<"custom" | "alpha" | "chrono">("chrono");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
  // Only generate if list is empty
  if (todos.length === 0) {
    const dummy = Array.from({ length: 5 }).map((_, idx) => ({
      id: String(uuid.v4()),
      text: `Sample Task ${idx + 1}`,
      createdAt: Date.now() - idx * 5000,
      completed: false,
      order: idx,
    }));

    setTodos(dummy);
  }
}, []);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: String(uuid.v4()),
      text,
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

  const deleteTodo = (id: string) => {
    setTodos((prev) =>
      prev
        .filter((t) => t.id !== id)
        .map((t, i) => ({ ...t, order: i }))
    );
  };

  const updateTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: newText } : t
      )
    );
  };

  const sorted = useMemo(() => {
    if (sortMode === "alpha") return sortAlphabetical(todos);
    if (sortMode === "chrono") return sortChronological(todos);
    return sortCustom(todos);
  }, [todos, sortMode]);

  return (
    <View className="bg-primary flex-1 p-5">
      {/* SORT DROPDOWN */}
      <View className="flex-row justify-end mb-4">
        <SortDropdown value={sortMode} onChange={setSortMode} />
      </View>

      {/* LIST */}
      <FlatList
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
      />

      {/* FLOATING ADD BUTTON */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="w-12 h-12 bg-blue-500 p-4 absolute bottom-8 right-8 rounded-full shadow-lg items-center justify-center"
      >
        <Text className="text-white text-3xl bottom-0.5">+</Text>
      </Pressable>

      {/* MODAL */}
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addTodo}
      />
    </View>
  );
}
