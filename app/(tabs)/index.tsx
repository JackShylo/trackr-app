import { useMemo, useState } from "react";
import { View, TextInput, Pressable, Text, FlatList } from "react-native";
import TodoItem from "../../components/ToDoItem";
import { Todo } from "../../types/Todo";
import { sortAlphabetical, sortChronological, sortCustom } from "../../utils/sorting";
import uuid from "react-native-uuid";
import SortDropdown from "../../components/SortOrderDropdown";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [sortMode, setSortMode] = useState<"custom" | "alpha" | "chrono">("custom");

  const addTodo = () => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: String(uuid.v4()),
      text,
      createdAt: Date.now(),
      completed: false,
      order: todos.length,
    };

    setTodos((prev) => [...prev, newTodo]);
    setText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

const deleteTodo = (id: string) => {
  setTodos((prev) =>
    prev
      .filter((t) => t.id !== id)
      .map((t, i) => ({ ...t, order: i })) // fix order gaps
  );
};

  const updateTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const sorted = useMemo(() => {
    if (sortMode === "alpha") return sortAlphabetical(todos);
    if (sortMode === "chrono") return sortChronological(todos);
    return sortCustom(todos);
  }, [todos, sortMode]);

  return (
    <View className="flex-1 p-5 bg-gray-100">

      {/* Input */}
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 p-3 bg-white rounded-lg mr-3"
          placeholder="Add a task..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
        />
        <Pressable onPress={addTodo} className="bg-blue-500 px-4 rounded-lg justify-center">
          <Text className="text-white font-bold">Add</Text>
        </Pressable>
      </View>

      {/* Sorting Buttons */}
      <View className="flex-row justify-between mb-4">
        <SortDropdown value={sortMode} onChange={setSortMode} />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
        )}
      />
    </View>
  );
}
