import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';




const NoGroup = () => {

    const handleCreateGroup = () => {
      router.push('/group/createGroup');
    }

    const handleJoinGroup = () => {
      router.push('/group/joinGroup');
    } 

  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-full px-10">
        <Text className="text-center mt-2 text-gray-600">You don't have a group yet, create a new one or join an existing one</Text>
      </View>
      <View className="flex-row justify-between mt-4 w-full px-10">
        <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-md w-40" onPress={handleCreateGroup}>
          <Text className="text-white font-semibold text-center">Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-500 px-6 py-2 rounded-md w-40" onPress={handleJoinGroup}>
          <Text className="text-white font-semibold text-center">Join Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoGroup;