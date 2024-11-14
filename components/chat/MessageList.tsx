import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { MessageData } from '@/src/firebase/firestore/types';

type MessageListProps = {
  messages: MessageData[];
  currentGroupId: string;
  isLoading: boolean;
};

export const MessageList = ({ messages, currentGroupId, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No messages yet. Start chatting!</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-4"
      contentContainerStyle={{ paddingVertical: 16 }}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnGroup={message.groupId === currentGroupId}
        />
      ))}
    </ScrollView>
  );
};