import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";

interface SectionProps {
    title: string,
    children?: React.ReactNode
}

export default function Section({ title, children }: SectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-gray-400 uppercase text-xs mb-2">
        {title}
      </Text>
      <View className="bg-white rounded-xl divide-y divide-gray-200">
        {children}
      </View>
    </View>
  );
}
