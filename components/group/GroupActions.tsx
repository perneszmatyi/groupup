import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroupContext } from '@/context/GroupContext';
import { useAuthContext } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

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
    <View className="px-4 py-6">
      <Text className="text-sm text-gray-400 mb-4 ml-1">Group Actions</Text>
      
      <TouchableOpacity
        onPress={handleAction}
        disabled={isLoading}
        className={`
          flex-row items-center p-4 rounded-xl border
          ${isAdmin 
            ? 'bg-red-900/20 border-red-900/30 active:bg-red-900/30' 
            : 'bg-gray-800/50 border-gray-700 active:bg-gray-800'
          } 
          ${isLoading ? 'opacity-50' : ''}
        `}
      >
        <Ionicons 
          name={isAdmin ? "trash-outline" : "exit-outline"} 
          size={24} 
          color={isAdmin ? "#EF4444" : "#60A5FA"}
        />
        <Text className={`ml-4 flex-1 font-medium text-base
          ${isAdmin ? 'text-red-400' : 'text-gray-300'}`}
        >
          {isLoading 
            ? 'Processing...' 
            : isAdmin 
              ? 'Delete Group' 
              : 'Leave Group'
          }
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isAdmin ? "#EF4444" : "#60A5FA"}
        />
      </TouchableOpacity>
    </View>
  );
};