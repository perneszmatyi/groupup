import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroupContext } from '@/context/GroupContext';
import { useAuthContext } from '@/context/AuthContext';

type GroupActionsProps = {
  adminId: string;
  onLeaveGroup: () => Promise<void>;
  onDeleteGroup: () => Promise<void>;
};

export const GroupActions = ({ adminId, onLeaveGroup, onDeleteGroup }: GroupActionsProps) => {
  const { userAuth } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdmin = userAuth?.uid === adminId;

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        Alert.alert(
          'Delete Group',
          'Are you sure you want to delete this group? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await onDeleteGroup();
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Leave Group',
          'Are you sure you want to leave this group?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Leave',
              style: 'destructive',
              onPress: async () => {
                await onLeaveGroup();
                router.replace('/(tabs)');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to perform action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 mt-4">
      <TouchableOpacity
        onPress={handleAction}
        disabled={isLoading}
        className={`p-3 rounded-lg ${
          isAdmin ? 'bg-red-500' : 'bg-gray-500'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        <Text className="text-white text-center font-semibold">
          {isLoading 
            ? 'Processing...' 
            : isAdmin 
              ? 'Delete Group' 
              : 'Leave Group'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};