import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const handleLogout = () => {
    // Here you would typically clear any authentication tokens or user data
    // For now, we'll just navigate to the index page
    router.replace('/');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Profile</Text>
      <Text className="mt-2 text-gray-600">Your profile information</Text>
      <TouchableOpacity 
        className="bg-red-500 p-2 rounded-md mt-4" 
        onPress={handleLogout}
      >
        <Text className="text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
