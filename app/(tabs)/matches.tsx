import React from 'react';
import { View, Text } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';

const MatchesScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Matches</Text>
      <NoGroup />
    </View>
  );
};

export default MatchesScreen;
