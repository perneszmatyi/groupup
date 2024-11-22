import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useGroupContext } from '@/context/GroupContext';
import NoGroup from '../../components/group/NoGroup';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MatchesScreen = () => {
  const { currentGroup, matchedGroups } = useGroupContext();

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
          <Text className="text-neutral-body text-center text-lg mb-2">
            No matches yet
          </Text>
          <Text className="text-neutral-body text-center text-base opacity-70">
            Start swiping to find and match with other groups!
          </Text>
        </View>
      );
    }

    if (!matchedGroups || matchedGroups.length === 0) {
      return (
          <View className="flex-1 justify-center items-center p-8">
            <Text>Loading matches...</Text>
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
              className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
              onPress={() => router.push(`/chat/${chatId}`)}
            >
              <View className="p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-neutral-light justify-center items-center mr-4">
                  {matchedGroup.photo ? (
                    <Image 
                      source={{ uri: matchedGroup.photo }} 
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Ionicons name="people" size={24} color="#6B7280" />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-neutral-text mb-1">
                    {matchedGroup.name}
                  </Text>
                  <Text className="text-neutral-body text-sm" numberOfLines={1}>
                    {matchedGroup.description}
                  </Text>
                </View>

                <View className="items-end">
                  <View className="flex-row items-center bg-neutral-lighter rounded-full px-3 py-1 mb-1">
                    <Ionicons name="people" size={14} color="#6B7280" />
                    <Text className="text-neutral-body text-sm ml-1">
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
    <View className="flex-1 bg-neutral-lighter safe-top">

      <View className="bg-white p-4 border-b border-neutral-light">
        <Text className="text-2xl font-bold text-neutral-text">
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
