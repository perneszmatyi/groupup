import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import NoGroup from '../../components/screens/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';

const SwipeScreen = () => {
  const { user } = useUserContext();
  const { availableGroups, isLoading, error, handleJoinGroup } = useGroupContext();

  const renderGroups = () => {
    if (isLoading) {
      return <Text className="text-gray-600">Loading groups...</Text>;
    }

    if (error) {
      return <Text className="text-red-500">{error}</Text>;
    }

    if (availableGroups.length === 0) {
      return <Text className="text-gray-600">No available groups found</Text>;
    }

    return (
      <ScrollView className="w-full px-4">
        {availableGroups.map((group) => (
          <View 
            key={group.id} 
            className="bg-white rounded-lg shadow-lg p-4 mb-4"
          >
            <Text className="text-xl font-bold mb-2">{group.name}</Text>
            <Text className="text-gray-600 mb-2">
              Members: {Object.keys(group.members).length}
            </Text>
            <Text className="text-gray-600 mb-4">{group.description}</Text>
            
              <Text className="text-white text-center font-semibold">
                Join Group
              </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold text-center py-4">Available Groups</Text>
      {!user?.currentGroup ? (
        <NoGroup />
      ) : (
        <View className="flex-1">
          {renderGroups()}
        </View>
      )}
    </View>
  );
};

export default SwipeScreen;
