import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type LoadingScreenProps = {
  message?: string;
};

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <View className="flex-1 bg-[#151718] justify-center items-center">
      <ActivityIndicator size="large" color="#60A5FA" />
      {message && (
        <Text className="text-gray-400 mt-4 text-base">
          {message}
        </Text>
      )}
    </View>
  );
};