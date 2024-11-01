import React from 'react';
import { View, Text } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';


const GroupScreen = () => {
  const { user } = useUserContext();
  const { group } = useGroupContext();

  return (
    (!user?.currentGroup) ? (
    <View className="flex-1 items-center bg-white">
      <Text className="text-2xl font-bold">Groups</Text>
      <NoGroup />
    </View>
  ) : (
    <View className="flex-1 items-center bg-white">
      <Text className="text-2xl font-bold">Groups</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">{group?.name}</Text>
        <Text className="text-lg">{group?.description}</Text>
        <Text className="text-lg font-bold">{group?.inviteCode}</Text>
      </View>
    </View>
  )
  )};

export default GroupScreen;
