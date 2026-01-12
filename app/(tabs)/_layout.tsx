import { Tabs } from 'expo-router';
import React from 'react';
import "@/app/global.css";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/useSettingsStore';
import { THEMES } from '@/constants/themes';

export default function TabLayout() {
  const theme = useSettingsStore((s) => s.theme);
  const themeConfig = THEMES[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeConfig.primary,
        tabBarInactiveTintColor: themeConfig.textSecondary,
        tabBarStyle: {
          backgroundColor: themeConfig.surface,
          borderTopColor: themeConfig.primaryLight,
          borderTopWidth: 0.5,
          paddingBottom: 6,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          size: 24,
        },
      }}>
      <Tabs.Screen
        name="lists/index"
        options={{
          tabBarLabel: 'Lists',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'list' : 'list-outline'} 
              size={size} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color}
            />
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
