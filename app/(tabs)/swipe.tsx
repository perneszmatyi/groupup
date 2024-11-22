import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import NoGroup from '../../components/group/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';
import { handleLike, handlePass } from '@/src/firebase/firestore/groups';
import { useAuthContext } from '@/context/AuthContext';

const SwipeScreen = () => {
  const { user } = useUserContext();
  const { currentGroup, availableGroups, isLoading, error, refreshGroups } = useGroupContext();
  const { userAuth } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = currentGroup && userAuth?.uid === currentGroup.createdBy;

  const onLike = async (targetGroupId: string) => {
    if (!currentGroup?.id || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const isMatch = await handleLike(currentGroup.id, targetGroupId);
      if (isMatch) {
        console.log("It's a match!");
        // Optional: Add some UI feedback for match
      }
      refreshGroups();
    } catch (error) {
      console.error('Error liking group:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onPass = async (targetGroupId: string) => {
    if (!currentGroup?.id || isProcessing) return;

    setIsProcessing(true);
    try {
      await handlePass(currentGroup.id, targetGroupId);
      refreshGroups();
    } catch (error) {
      console.error('Error passing group:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
            
            <View className="flex-row justify-around mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-4 rounded-full"
                onPress={() => onPass(group.id)}
                disabled={isProcessing}
              >
                <Text className="text-white font-bold">✕</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-green-500 p-4 rounded-full"
                onPress={() => onLike(group.id)}
                disabled={isProcessing}
              >
                <Text className="text-white font-bold">✓</Text>
              </TouchableOpacity>
            </View>
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
