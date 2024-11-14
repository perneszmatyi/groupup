import React from 'react';
import { View, Text } from 'react-native';
import { MessageData } from '@/src/firebase/firestore/types';

type MessageBubbleProps = {
  message: MessageData;
  isOwnGroup: boolean;  // To determine message side
};

export const MessageBubble = ({ message, isOwnGroup }: MessageBubbleProps) => {
  return (
    <View className={`flex-row ${isOwnGroup ? 'justify-end' : 'justify-start'} mb-2`}>
      <View 
        className={`
          max-w-[80%] 
          rounded-2xl 
          px-4 
          py-2
          ${isOwnGroup ? 'bg-blue-500' : 'bg-gray-200'}
        `}
      >
        <Text className="text-xs text-gray-600 mb-1">
          {message.senderName} • {message.groupId}
        </Text>
        <Text className={`${isOwnGroup ? 'text-white' : 'text-black'}`}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};