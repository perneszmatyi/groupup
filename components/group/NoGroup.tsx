import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoGroup = () => {
  const handleCreateGroup = () => {
    router.push('/group/createGroup');
  }

  const handleJoinGroup = () => {
    router.push('/group/joinGroup');
  }

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center mb-12">
        <View className="bg-gray-800/50 p-6 rounded-full mb-6">
          <Ionicons 
            name="people-outline" 
            size={48} 
            color="#60A5FA"
          />
        </View>
        <Text className="text-white text-2xl font-bold mb-3 text-center">
          No Group Yet
        </Text>
        <Text className="text-gray-400 text-center text-base">
          Create a new group or join an existing one to start matching with others
        </Text>
      </View>

      <View className="w-full px-4 space-y-4">
        <TouchableOpacity 
          onPress={handleCreateGroup}
          className="bg-primary p-4 rounded-xl active:bg-primary-dark flex-row items-center justify-center space-x-3 mb-4"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white font-semibold text-lg">
            Create New Group
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleJoinGroup}
          className="bg-secondary p-4 rounded-xl active:bg-secondary-dark flex-row items-center justify-center space-x-3"
        >
          <Ionicons name="enter-outline" size={24} color="white" />
          <Text className="text-white font-semibold text-lg">
            Join Existing Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoGroup;