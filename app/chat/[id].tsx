import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroupContext } from '@/context/GroupContext';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '@/hooks/useChat';
import { MessageInput } from '@/components/chat/MessageInput';
import { createChat } from '@/src/firebase/firestore/chats';
import { MessageList } from '@/components/chat/MessageList';

const ChatScreen = () => {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { currentGroup, matchedGroups } = useGroupContext();

  // Get the other group's ID from chat ID
  const otherGroupId = chatId?.split('_').find(id => id !== currentGroup?.id);
  const matchedGroup = matchedGroups?.find(group => group.id === otherGroupId);

  useEffect(() => {
    const initializeChat = async () => {
      if (currentGroup?.id && matchedGroup?.id) {
        try {
          await createChat(currentGroup.id, matchedGroup.id);
        } catch (error) {
          // If error is because chat already exists, that's fine
          console.log('Chat initialization:', error);
        }
      }
    };

    initializeChat();
  }, [currentGroup?.id, matchedGroup?.id]);


  // Use our chat hook
  const { messages, sendMessage, isLoading, error } = useChat(chatId);

  if (!chatId || !currentGroup || !matchedGroup) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-bold">{matchedGroup.name}</Text>
          <Text className="text-sm text-gray-500">
            {Object.keys(matchedGroup.members).length} members
          </Text>
        </View>
      </View>

      {/* Temporary Messages Display */}
      <View className="flex-1 p-4">
        {isLoading ? (
          <Text>Loading messages...</Text>
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : messages.length === 0 ? (
          <Text className="text-gray-500">No messages yet. Start chatting!</Text>
        ) : (
          <MessageList messages={messages} currentGroupId={currentGroup.id} isLoading={isLoading} />
        )}
      </View>
      <MessageInput onSend={sendMessage} />
    </SafeAreaView>
  );
};

export default ChatScreen;