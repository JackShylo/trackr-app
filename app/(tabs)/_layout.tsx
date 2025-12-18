import { Tabs } from 'expo-router';
import React from 'react';
import "@/app/global.css";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false
      }}>
      <Tabs.Screen
        name="lists"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
      {/* 🔒 Hide lists/[listId] from the tab bar */}
      <Tabs.Screen
        name="lists/[listId]"
        options={{
          href: null, // 👈 removes it from the bottom tab bar
        }}
      />
    </Tabs>
  );
}
