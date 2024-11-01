import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useAuthContext } from '@/context/AuthContext';
import { useUserContext } from '@/context/UserContext';

const ProfileScreen = () => {

  const { handleLogout } = useAuthContext();
  const { user } = useUserContext();



  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Profile</Text>
      <Text className="mt-2 text-gray-600">Your profile information</Text>
      <Text className="mt-2 text-gray-600">{user?.firstName}</Text>
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
