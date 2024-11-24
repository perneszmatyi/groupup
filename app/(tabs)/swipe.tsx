import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';
import { fetchActiveGroups, handleLike, handlePass } from '@/src/firebase/firestore/groups';
import { GroupData } from '@/src/firebase/firestore/types';
import { LinearGradient } from 'expo-linear-gradient';
import NoGroup from '@/components/group/NoGroup';
import { LoadingScreen } from '@/components/screens/LoadingScreen';
const { width, height } = Dimensions.get('window');

const NonAdminView = () => (
  <View className="flex-1 bg-[#151718] justify-center items-center p-8">
    <Ionicons 
      name="lock-closed-outline" 
      size={64} 
      color="#9CA3AF"
      className="mb-4"
    />
    <Text className="text-white text-center text-lg mb-2">
      Admin Access Only
    </Text>
    <Text className="text-white text-center text-base opacity-70">
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
    if (currentGroup?.isActive) {
      loadGroups();
    } else {
      setIsLoading(false);
      console.log('currentGroup', currentGroup);
    }
  }, [currentGroup?.isActive]);

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
      }
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };



  if (!currentGroup) {
    return (
      <View className="flex-1 bg-[#151718]">
        <View className="bg-gray-800/50 p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white">Swipe</Text>
        </View>
        <NoGroup />
      </View>
    );
  }

  if (currentGroup.createdBy !== user?.id) {
    return (
      <View className="flex-1 bg-[#151718]">
        <View className="bg-gray-800/50 p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white">Swipe</Text>
        </View>
        <NonAdminView />
      </View>
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Loading groups..." />;
  }

  if (!currentGroup?.isActive) {
    return (
      <View className="flex-1 bg-[#151718]">
        <View className="bg-gray-800/50 p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white">Swipe</Text>
        </View>
  
        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center mb-12">
            <View className="bg-gray-800/50 p-6 rounded-full mb-6">
              <Ionicons 
                name="people-outline" 
                size={48} 
                color="#60A5FA"
              />
            </View>
            <Text className="text-white text-2xl font-bold mb-3 text-center">
              Group Not Active
            </Text>
            <Text className="text-gray-400 text-center text-base">
              You need at least 2 members to activate your group
            </Text>
          </View>
  
          <View className="w-full">
            <View className="bg-gray-800/50 p-4 rounded-xl items-center border border-gray-700">
              <Text className="text-sm text-gray-400 mb-2">Share this invite code</Text>
              <Text className="font-mono text-2xl tracking-wider text-blue-400">
                {currentGroup.inviteCode}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (groups.length === 0 || currentIndex >= groups.length) {
    return (
      <View className="flex-1 bg-[#151718]">
        <View className="bg-gray-800/50 p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white">Swipe</Text>
        </View>
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons 
            name="search-outline" 
            size={64} 
            color="#9CA3AF"
            className="mb-4"
          />
          <Text className="text-white text-center text-lg mb-2">
            No Groups Found
          </Text>
          <Text className="text-white text-center text-base opacity-70">
            There are no more groups to match with right now.
          </Text>
        </View>
      </View>
    );
  }

  const currentSwipeGroup = groups[currentIndex];

  return (
    <View className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white">Swipe</Text>
      </View>
      
      <View className="flex-1">
        <ImageBackground
          source={currentSwipeGroup.photo ? { uri: currentSwipeGroup.photo } : require('@/assets/group-default.jpg')}
          className="w-full h-full"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            className="flex-1"
            style={{ height: '100%' }}
          >
            <View className="flex-1" />
            
            <View className="px-6 pb-4 items-center space-y-4">
              <Text className="text-white text-3xl font-bold text-center">
                {currentSwipeGroup.name}
              </Text>
              <View className="flex-row items-center justify-between space-x-3">
                <Text className="text-white/90 text-lg leading-6 text-center">
                  {currentSwipeGroup.description}
                </Text>
                <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center">
                  <Ionicons name="people" size={16} color="white" />
                  <Text className="text-white text-sm ml-1 font-medium">
                    {Object.keys(currentSwipeGroup.members).length}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center space-x-12 p-8">
              <TouchableOpacity 
                onPress={handlePassPress}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg justify-center items-center border-2 border-white/20 active:bg-white/20"
              >
                <Ionicons name="close" size={32} color="white" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleLikePress}
                className="w-16 h-16 rounded-full bg-primary justify-center items-center active:bg-primary-dark"
              >
                <Ionicons name="heart" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
};

export default SwipeScreen;