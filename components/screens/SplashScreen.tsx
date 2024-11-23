import React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SplashScreen = () => {
  return (
    <View className="flex-1 bg-[#151718] justify-center items-center">
      <Ionicons
        name="people"
        size={96}
        color="#60A5FA"
        style={{ marginBottom: 24 }}
      />
      
      <Text className="text-white text-2xl font-bold mb-8">
        GroupUp
      </Text>
      
      <ActivityIndicator size="small" color="#60A5FA" />
    </View>
  );
};
