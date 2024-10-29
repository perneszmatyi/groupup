import React from 'react';
import { View, Text } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';
const SwipeScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Swipe</Text>
      <NoGroup />
    </View>
  );
};

export default SwipeScreen;
