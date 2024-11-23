import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createFirestoreGroup } from '../../src/firebase/firestore/groups';
import { auth } from '../../firebaseConfig';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreateGroup = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await createFirestoreGroup({
        name: groupName,
        description: description,
        createdBy: user.uid,
      });
      router.push('/(tabs)/group');
    } catch (error) {
      console.error('Error creating group: ', error);
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
        <Text className="text-2xl font-bold text-white">Create Group</Text>
      </View>

      <ScrollView 
        className="flex-1 p-6 h-full"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          <View className="bg-gray-800/50 p-6 rounded-full mb-6">
            <Ionicons 
              name="add-circle-outline" 
              size={48} 
              color="#60A5FA"
            />
          </View>
          <Text className="text-white text-2xl font-bold mb-3 text-center">
            Create a New Group
          </Text>
          <Text className="text-gray-400 text-center text-base">
            Start a new group and invite others to join
          </Text>
        </View>

        <View className="space-y-6 h-full">
          <View>
            <Text className="text-sm text-gray-400 mb-2 ml-1">Group Name</Text>
            <TextInput
              className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 text-white text-base"
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter group name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-400 mb-2 ml-1">Description</Text>
            <TextInput
              className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 text-white text-base"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your group"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            className="bg-primary p-4 rounded-xl active:bg-primary-dark mt-4"
            onPress={handleCreateGroup}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGroup;
