import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import TodoItem from "../../components/TaskItem";
import { Todo } from "../../types/Task";
import { sortAlphabetical, sortChronological, sortCustom } from "../../utils/sorting";
import uuid from "react-native-uuid";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [sortMode, setSortMode] = useState<"custom" | "alpha" | "chrono">("custom");

  const addTodo = () => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: uuid.v4().toString(),
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
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const getSortedTodos = () => {
    if (sortMode === "alpha") return sortAlphabetical(todos);
    if (sortMode === "chrono") return sortChronological(todos);
    return sortCustom(todos);
  };

  const sorted = getSortedTodos();

  const handleDragEnd = ({ data }: { data: Todo[] }) => {
    const updated = data.map((item, index) => ({ ...item, order: index }));
    setTodos(updated);
  };

  const updateTodo = (id: string, newText: string) => {
  setTodos((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    )
  );
};

  
const renderItem = ({ item, drag }: RenderItemParams<Todo>) => (
  <Pressable onLongPress={drag}>
    <TodoItem
      item={item}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
      onUpdate={updateTodo}
    />
  </Pressable>
);


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
        <Pressable
          onPress={() => setSortMode("custom")}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Text>Custom</Text>
        </Pressable>

        <Pressable
          onPress={() => setSortMode("alpha")}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Text>A–Z</Text>
        </Pressable>

        <Pressable
          onPress={() => setSortMode("chrono")}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Text>Oldest</Text>
        </Pressable>
      </View>

      {/* Drag + Drop List */}
      <DraggableFlatList
        data={sorted}
        onDragEnd={handleDragEnd}
        keyExtractor={(item: Todo) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
