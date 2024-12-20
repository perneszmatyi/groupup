import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { MessageData } from '@/src/firebase/firestore/types';
import { LoadingScreen } from '@/components/screens/LoadingScreen';

type MessageListProps = {
  messages: MessageData[];
  currentGroupId: string;
  isLoading: boolean;
};

export const MessageList = ({ messages, currentGroupId, isLoading }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-400">No messages yet. Start chatting!</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-4"
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
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