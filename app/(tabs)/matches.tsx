import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useGroupContext } from '@/context/GroupContext';
import NoGroup from '../../components/screens/NoGroup';

const MatchesScreen = () => {
  const { currentGroup, matchedGroups } = useGroupContext();

  const renderMatches = () => {
    if (!currentGroup?.matches || Object.keys(currentGroup.matches).length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-600 text-center">
            No matches yet. Keep swiping to find groups!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView className="w-full px-4">
        {matchedGroups.map((matchedGroup) => (
          <View 
            key={matchedGroup.id}
            className="bg-white rounded-lg shadow-lg p-4 mb-4"
          >
            <Text className="text-xl font-bold mb-2">
                {matchedGroup.name}
            </Text>
            <Text className="text-gray-600">{matchedGroup.description}</Text>
            <Text className="text-gray-600">{Object.keys(matchedGroup.members).length} members</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold text-center py-4">Matches</Text>
      {!currentGroup ? (
        <NoGroup />
      ) : (
        renderMatches()
      )}
    </View>
  );
};

export default MatchesScreen;
