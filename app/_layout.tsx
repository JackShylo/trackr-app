import "react-native-gesture-handler";
import "react-native-reanimated";
import "./global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NativeWindProvider } from '../components/nativewind-provider';
import { useEffect, useState } from "react";
import { loadLists } from "../utils/storage";
import { List } from "..//types/List";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

    // Load lists on app start
  useEffect(() => {
    loadLists().then((stored) => {
    });
  }, []);
  
  return (
    <NativeWindProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NativeWindProvider>
  );
}
