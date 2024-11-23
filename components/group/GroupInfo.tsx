import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type GroupInfoProps = {
  name: string;
  description: string;
  photo: string | null;
  inviteCode: string;
  onUpdate: (data: { 
    name?: string; 
    description?: string; 
    photo?: string;
  }) => Promise<void>;
};

export const GroupInfo = ({ 
  name, 
  description, 
  photo, 
  inviteCode, 
  onUpdate 
}: GroupInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);
  const [newPhotoUrl, setNewPhotoUrl] = useState(photo || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate({
        name: newName.trim(),
        description: newDescription.trim(),
        photo: newPhotoUrl.trim() || ''
      });
      setIsEditing(false);
      Alert.alert('Success', 'Group information updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update group information');
      console.error('Error updating group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="items-center py-6 relative">
        <Image
          source={
            photo 
              ? { uri: photo }
              : require('@/assets/group-default.jpg')
          }
          className="w-32 h-32 rounded-full bg-gray-200"
        />
        
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          className="absolute top-6 right-4"
        >
          <Ionicons 
            name={isEditing ? "close" : "settings-outline"} 
            size={24} 
            color="#3b82f6"
          />
        </TouchableOpacity>

        <Text className="text-xl font-bold mt-4">{name}</Text>
      </View>

      {isEditing ? (
        <ScrollView className="p-4">
          <Text className="text-sm text-gray-600 mb-1">Photo URL</Text>
          <TextInput
            value={newPhotoUrl}
            onChangeText={setNewPhotoUrl}
            placeholder="Enter image URL"
            className="border border-gray-300 rounded-lg p-2 mb-4"
            autoCapitalize="none"
          />

          <Text className="text-sm text-gray-600 mb-1">Group Name</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            className="border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Enter group name"
          />


          <Text className="text-sm text-gray-600 mb-1">Description</Text>
          <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            className="border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Enter group description"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity 
            onPress={handleSave}
            className={`p-3 rounded-lg ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View className="p-4">
          <View className="mb-4">
            <Text className="text-sm text-gray-600">Description</Text>
            <Text className="mt-1">{description || 'No description'}</Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-lg items-center">
            <Text className="text-sm text-gray-600 mb-2">Group Invite Code</Text>
            <Text className="font-mono text-2xl tracking-wider text-blue-600">
              {inviteCode}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};