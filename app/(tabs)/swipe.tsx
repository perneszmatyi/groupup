import React from 'react';
import { View, Text } from 'react-native';

const SwipeScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Swipe</Text>
      <Text className="mt-2 text-gray-600">Swipe to find new matches!</Text>
    </View>
  );
};

export default SwipeScreen;
