import React from 'react';
import { View, Text } from 'react-native';

const MatchesScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Matches</Text>
      <Text className="mt-2 text-gray-600">Your matches will appear here</Text>
    </View>
  );
};

export default MatchesScreen;
