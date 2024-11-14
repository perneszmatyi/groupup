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

  // Get the other group's ID from chat ID
  const otherGroupId = chatId?.split('_').find(id => id !== currentGroup?.id);
  const matchedGroup = matchedGroups?.find(group => group.id === otherGroupId);

  // Use our chat hook
  const { messages, sendMessage, isLoading, error } = useChat(chatId);

  if (!chatId || !currentGroup || !matchedGroup) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-neutral-light">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View className="ml-2 flex-1">
          <Text className="text-lg font-semibold text-neutral-text">
            {matchedGroup.name}
          </Text>
          <Text className="text-sm text-neutral-body">
            {Object.keys(matchedGroup.members).length} members
          </Text>
        </View>
      </View>

      {/* Chat Content */}
      <View className="flex-1 bg-neutral-lighter">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-danger text-center">{error}</Text>
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-neutral-body text-center">
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

      {/* Message Input */}
      <MessageInput onSend={sendMessage} />
    </SafeAreaView>
  );
};

export default ChatScreen;