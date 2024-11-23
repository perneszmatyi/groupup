import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useGroupContext } from '@/context/GroupContext';
import NoGroup from '../../components/group/NoGroup';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const MatchesScreen = () => {
  const { currentGroup, matchedGroups } = useGroupContext();
  const colors = Colors['dark'];

  const renderMatches = () => {
    if (!currentGroup?.matches || Object.keys(currentGroup.matches).length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons 
            name="people-outline" 
            size={64} 
            color="#9CA3AF"
            className="mb-4"
          />
          <Text className="text-white text-center text-lg mb-2">
            No matches yet
          </Text>
          <Text className="text-white/70 text-center text-base">
            Start swiping to find and match with other groups!
          </Text>
        </View>
      );
    }

    if (!matchedGroups || matchedGroups.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-white">Loading matches...</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {matchedGroups.map((matchedGroup) => {
          const chatId = [currentGroup?.id, matchedGroup.id].sort().join('_');
          
          return (
            <TouchableOpacity 
              key={matchedGroup.id}
              className="bg-gray-800/50 rounded-2xl mb-4 overflow-hidden border border-gray-700"
              onPress={() => router.push(`/chat/${chatId}`)}
            >
              <View className="p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mr-4">
                  {matchedGroup.photo ? (
                    <Image 
                      source={{ uri: matchedGroup.photo }} 
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Ionicons name="people" size={24} color="#9CA3AF" />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white mb-1">
                    {matchedGroup.name}
                  </Text>
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {matchedGroup.description}
                  </Text>
                </View>

                <View className="items-end">
                  <View className="flex-row items-center bg-gray-700/50 rounded-full px-3 py-1 mb-1">
                    <Ionicons name="people" size={14} color="#9CA3AF" />
                    <Text className="text-gray-300 text-sm ml-1">
                      {Object.keys(matchedGroup.members).length}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white">
          Matches
        </Text>
      </View>

      {!currentGroup ? (
        <NoGroup />
      ) : (
        renderMatches()
      )}
    </View>
  );
};

export default MatchesScreen;
