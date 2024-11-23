import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '@/components/screens/LoadingScreen';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ... your existing group info loading logic
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Loading group info..." />;
  }

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
    <View className="flex-1 bg-[#151718]">
      <View className="items-center py-6 relative">
        <Image
          source={
            photo 
              ? { uri: photo }
              : require('@/assets/group-default.jpg')
          }
          className="w-32 h-32 rounded-full bg-gray-800"
        />
        
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          className="absolute top-6 right-4"
        >
          <Ionicons 
            name={isEditing ? "close" : "settings-outline"} 
            size={24} 
            color="#60A5FA"
          />
        </TouchableOpacity>

        <Text className="text-xl font-bold mt-4 text-white">{name}</Text>
      </View>

      {isEditing ? (
        <ScrollView className="p-4">
          <Text className="text-sm text-gray-300 mb-1">Photo URL</Text>
          <TextInput
            value={newPhotoUrl}
            onChangeText={setNewPhotoUrl}
            placeholder="Enter image URL"
            className="border border-gray-600 bg-gray-800 rounded-lg p-2 mb-4 text-white"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />

          <Text className="text-sm text-gray-300 mb-1">Group Name</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            className="border border-gray-600 bg-gray-800 rounded-lg p-2 mb-4 text-white"
            placeholder="Enter group name"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-sm text-gray-300 mb-1">Description</Text>
          <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            className="border border-gray-600 bg-gray-800 rounded-lg p-2 mb-4 text-white"
            placeholder="Enter group description"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity 
            onPress={handleSave}
            className={`p-3 rounded-lg ${isLoading ? 'bg-blue-600/50' : 'bg-blue-600'}`}
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
            <Text className="text-sm text-gray-400">Description</Text>
            <Text className="mt-1 text-white">{description || 'No description'}</Text>
          </View>

          <View className="bg-gray-800/50 p-4 rounded-lg items-center">
            <Text className="text-sm text-gray-400 mb-2">Group Invite Code</Text>
            <Text className="font-mono text-2xl tracking-wider text-blue-400">
              {inviteCode}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};