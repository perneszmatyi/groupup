import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 10,
          },
        }}>

        <Tabs.Screen
          name="group"
          options={{
            title: 'Groups',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="swipe"
          options={{
            title: 'Swipe',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
