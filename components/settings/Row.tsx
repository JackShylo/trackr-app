import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";

interface RowProps {
    label?: string,
    value?: string,
    danger?: boolean
}

export default function Row({ label, value, danger }: RowProps) {
  return (
    <Pressable className="flex-row justify-between items-center px-4 py-3">
      <Text className={danger ? "text-red-500" : "text-gray-900"}>
        {label}
      </Text>
      {value && (
        <Text className="text-gray-400 text-sm">{value}</Text>
      )}
    </Pressable>
  );
}
