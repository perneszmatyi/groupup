import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGroupContext } from '../../context/GroupContext';

const JoinGroup = () => {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();
  const { handleJoinGroup } = useGroupContext();

  const handleSubmit = async () => {
    try {
      await handleJoinGroup(inviteCode);
      router.push('/(tabs)/group');
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="p-6">
        <TouchableOpacity 
          className="absolute left-4 top-4 z-10"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-6 text-center">Join Group</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-2 text-center">Invite Code</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3"
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Enter invite code"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-md"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold">Join Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default JoinGroup;
