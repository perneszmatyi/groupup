import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';
import { fetchActiveGroups, handleLike, handlePass } from '@/src/firebase/firestore/groups';
import { GroupData } from '@/src/firebase/firestore/types';
const { width, height } = Dimensions.get('window');

const NonAdminView = () => (
  <View className="flex-1 bg-white justify-center items-center p-8">
    <Ionicons 
      name="lock-closed-outline" 
      size={64} 
      color="#9CA3AF"
      className="mb-4"
    />
    <Text className="text-neutral-body text-center text-lg mb-2">
      Admin Access Only
    </Text>
    <Text className="text-neutral-body text-center text-base opacity-70">
      Only group admins can match with other groups.
    </Text>
  </View>
);

const SwipeScreen = () => {
  const { user } = useUserContext();
  const { currentGroup } = useGroupContext();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    if (!currentGroup?.id) return;
    try {
      setIsLoading(true);
      const activeGroups = await fetchActiveGroups(currentGroup.createdBy, currentGroup.id);
      setGroups(activeGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassPress = async () => {
    if (!currentGroup?.id || currentIndex >= groups.length) return;
    try {
      await handlePass(currentGroup.id, groups[currentIndex].id);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error handling pass:', error);
    }
  };

  const handleLikePress = async () => {
    if (!currentGroup?.id || currentIndex >= groups.length) return;
    try {
      const isMatch = await handleLike(currentGroup.id, groups[currentIndex].id);
      if (isMatch) {
        // Show match notification if needed
      }
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  if (!currentGroup) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-4">
        <Text className="text-neutral-body text-center text-lg">
          Join or create a group to start matching!
        </Text>
      </View>
    );
  }

  if (currentGroup.createdBy !== user?.id) {
    return <NonAdminView />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading groups...</Text>
      </View>
    );
  }

  if (groups.length === 0 || currentIndex >= groups.length) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-8">
        <Ionicons 
          name="search-outline" 
          size={64} 
          color="#9CA3AF"
          className="mb-4"
        />
        <Text className="text-neutral-body text-center text-lg mb-2">
          No Groups Found
        </Text>
        <Text className="text-neutral-body text-center text-base opacity-70">
          There are no more groups to match with right now.
        </Text>
      </View>
    );
  }

  const currentSwipeGroup = groups[currentIndex];

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={currentSwipeGroup.photo ? { uri: currentSwipeGroup.photo } : require('@/assets/group-default.jpg')}
        className="w-full h-full"
      >
        {/* Dark overlay and content */}
        <View className="flex-1 bg-black/40">
          {/* This empty View pushes the content to the bottom */}
          <View className="flex-1" />
          
          {/* Group info section */}
          <View className="p-6 space-y-4">
            <Text className="text-white text-3xl font-bold">
              {currentSwipeGroup.name}
            </Text>
            <Text className="text-white text-lg">
              {currentSwipeGroup.description}
            </Text>
            <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1 self-start">
              <Ionicons name="people" size={16} color="white" />
              <Text className="text-white text-sm ml-1">
                {Object.keys(currentSwipeGroup.members).length} members
              </Text>
            </View>
          </View>

          {/* Buttons section */}
          <View className="flex-row justify-center items-center space-x-8 p-8">
            <TouchableOpacity 
              onPress={handlePassPress}
              className="w-16 h-16 rounded-full bg-red-500 justify-center items-center shadow-lg"
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLikePress}
              className="w-16 h-16 rounded-full bg-green-500 justify-center items-center shadow-lg"
            >
              <Ionicons name="checkmark" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SwipeScreen;