import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createFirestoreGroup } from '../../src/firebase/firestore/groups';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreateGroup = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user logged in');
        return;
      }
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
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="p-6">
        <TouchableOpacity 
          className="absolute left-4 top-4 z-10"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-6 text-center">Create New Group</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-2 text-center">Group Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3"
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter group name"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-2 text-center">Description</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your group"
              multiline
              numberOfLines={4}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-md mt-6"
            onPress={handleCreateGroup}
          >
            <Text className="text-white text-center font-semibold">Create Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateGroup;
