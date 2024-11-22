import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useUserContext } from '@/context/UserContext';
import { useAuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { updateUserProfile, deleteUserAccount } from '@/src/firebase/firestore/users';

const ProfileScreen = () => {
  const { user } = useUserContext();
  const { userAuth, authLogout } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!userAuth?.uid) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(userAuth.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(profilePicture && { profilePicture: profilePicture.trim() })
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!userAuth?.uid) return;
            setIsLoading(true);
            try {
              await deleteUserAccount(userAuth.uid);
              await handleLogout();
              router.replace('/');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center pt-8 pb-4">
        <View className="relative">
          <Image
            source={
              user?.profilePicture 
                ? { uri: user.profilePicture }
                : require('@/assets/default.png')
            }
            className="w-24 h-24 rounded-full bg-gray-200"
          />
        </View>

        {isEditing ? (
          <View className="w-full px-4 mt-4 space-y-4">
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <TextInput
              value={profilePicture}
              onChangeText={setProfilePicture}
              placeholder="Profile Picture URL"
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity 
                onPress={() => {
                  setIsEditing(false);
                  setFirstName(user?.firstName || '');
                  setLastName(user?.lastName || '');
                  setProfilePicture(user?.profilePicture || '');
                }}
                className="bg-gray-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleUpdateProfile}
                className="bg-blue-500 px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-white">
                  {isLoading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center mt-4">
            <Text className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </Text>
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              className="mt-2"
            >
              <Text className="text-blue-500">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="p-4 space-y-4">
        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <Ionicons name="log-out-outline" size={24} color="#374151" />
          <Text className="ml-4 text-gray-700">Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleDeleteAccount}
          className="flex-row items-center p-4 bg-red-100 rounded-lg"
          disabled={isLoading}
        >
          <Ionicons name="trash-outline" size={24} color="#DC2626" />
          <Text className="ml-4 text-red-600">
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;