import React from 'react';
import { View, Text } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';

const SwipeScreen = () => {
  const { user } = useUserContext();
  const { group } = useGroupContext();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Swipe</Text>
      {!user?.currentGroup ? (
        <NoGroup />
      ) : (
        <View className="flex-1 items-center justify-center">
        </View>
      )}
    </View>
  );
};

export default SwipeScreen;
