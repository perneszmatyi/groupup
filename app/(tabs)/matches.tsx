import React from 'react';
import { View, Text } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';

const MatchesScreen = () => {
  const { user } = useUserContext();
  const { group } = useGroupContext();

  return (
    (!user?.currentGroup) ? (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Matches</Text>
      <NoGroup />
    </View>
  ) : (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Matches</Text>
    </View>
  )
  );
};

export default MatchesScreen;
