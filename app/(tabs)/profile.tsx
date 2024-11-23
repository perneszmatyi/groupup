import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useUserContext } from '@/context/UserContext';
import { useAuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { updateUserProfile, deleteUserAccount } from '@/src/firebase/firestore/users';
import { LoadingScreen } from '@/components/screens/LoadingScreen';

const ProfileScreen = () => {
  const { user } = useUserContext();
  const { userAuth, authLogout } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !userAuth) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (isLoading) {
    return <LoadingScreen message="Updating profile..." />;
  }

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
    <View className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white">Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center pt-8 pb-8">
          <Image
            source={
              user?.profilePicture 
                ? { uri: user.profilePicture }
                : require('@/assets/default.png')
            }
            className="w-28 h-28 rounded-full bg-gray-800"
          />
          <View className="items-center mt-6">
            <Text className="text-2xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-gray-400 mt-2">
              {userAuth?.email}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View className="w-full px-6 space-y-6">
            <View>
              <Text className="text-sm text-gray-400 mb-2 ml-1">First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
                className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 w-full text-white text-base"
              />
            </View>

            <View>
              <Text className="text-sm text-gray-400 mb-2 ml-1">Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
                className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 w-full text-white text-base"
              />
            </View>

            <View>
              <Text className="text-sm text-gray-400 mb-2 ml-1">Profile Picture URL</Text>
              <TextInput
                value={profilePicture}
                onChangeText={setProfilePicture}
                placeholder="Enter image URL"
                placeholderTextColor="#9CA3AF"
                className="border border-gray-600 bg-gray-800/50 rounded-xl p-4 w-full text-white text-base"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row justify-between space-x-4 mt-8">
              <TouchableOpacity 
                onPress={() => {
                  setIsEditing(false);
                  setFirstName(user?.firstName || '');
                  setLastName(user?.lastName || '');
                  setProfilePicture(user?.profilePicture || '');
                }}
                className="flex-1 bg-white/10 p-4 rounded-xl active:bg-white/20"
              >
                <Text className="text-white font-semibold text-center text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleUpdateProfile}
                disabled={isLoading}
                className={`flex-1 bg-primary p-4 rounded-xl ${isLoading ? 'opacity-50' : ''} active:bg-primary-dark`}
              >
                <Text className="text-white font-semibold text-center text-base">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="px-6 space-y-4">
            <Text className="text-sm text-gray-400 mb-2 ml-1">Account Settings</Text>
            
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              className="flex-row items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 active:bg-gray-800"
            >
              <Ionicons name="settings-outline" size={24} color="#60A5FA" />
              <Text className="ml-4 flex-1 text-gray-300 font-medium text-base">Profile Settings</Text>
              <Ionicons name="chevron-forward" size={24} color="#60A5FA" />
            </TouchableOpacity>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                onPress={handleLogout}
                className="w-[49%] flex-row items-center justify-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 active:bg-gray-800"
              >
                <Ionicons name="log-out-outline" size={24} color="#60A5FA" />
                <Text className="ml-3 text-gray-300 font-medium text-base">Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleDeleteAccount}
                disabled={isLoading}
                className={`w-[49%] flex-row items-center justify-center p-4 bg-red-900/20 rounded-xl border border-red-900/30 
                  ${isLoading ? 'opacity-50' : ''} active:bg-red-900/30`}
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text className="ml-3 text-red-400 font-medium text-base">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;