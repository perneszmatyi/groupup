import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGroupContext } from '@/context/GroupContext';
import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';

const ChatScreen = () => {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { currentGroup, matchedGroups } = useGroupContext();

  const otherGroupId = chatId?.split('_').find(id => id !== currentGroup?.id);
  const matchedGroup = matchedGroups?.find(group => group.id === otherGroupId);

  const { messages, sendMessage, isLoading, error } = useChat(chatId);

  if (!chatId || !currentGroup || !matchedGroup) {
    return (
      <View className="flex-1 justify-center items-center bg-[#151718]">
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.replace('/matches')}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">
            {matchedGroup.name}
          </Text>
          <Text className="text-sm text-gray-400">
            {Object.keys(matchedGroup.members).length} members
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-[#151718]">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#60A5FA" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-red-400 text-center">{error}</Text>
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-gray-400 text-center">
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          <MessageList 
            messages={messages} 
            currentGroupId={currentGroup.id} 
            isLoading={isLoading} 
          />
        )}
      </View>

      <MessageInput onSend={sendMessage} />
    </SafeAreaView>
  );
};

export default ChatScreen;