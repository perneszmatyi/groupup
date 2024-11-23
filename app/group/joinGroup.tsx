import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Join Group</Text>
      </View>

      <ScrollView 
        className="flex-1 p-6 h-full"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          <View className="bg-gray-800/50 p-6 rounded-full mb-6">
            <Ionicons 
              name="people-outline" 
              size={48} 
              color="#60A5FA"
            />
          </View>
          <Text className="text-white text-2xl font-bold mb-3 text-center">
            Join a Group
          </Text>
          <Text className="text-gray-400 text-center text-base">
            Enter the invite code to join an existing group
          </Text>
        </View>

        <View className="space-y-6 h-full">
          <View>
            <Text className="text-sm text-gray-400 mb-2 ml-1">Invite Code</Text>
            <TextInput
              className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 text-white text-base font-mono tracking-wider text-center uppercase"
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Enter invite code"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            className="bg-primary p-4 rounded-xl active:bg-primary-dark mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Join Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JoinGroup;
