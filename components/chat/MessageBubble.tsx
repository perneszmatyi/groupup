import React from 'react';
import { View, Text } from 'react-native';
import { MessageData } from '@/src/firebase/firestore/types';

type MessageBubbleProps = {
  message: MessageData;
  isOwnGroup: boolean;
};

export const MessageBubble = ({ message, isOwnGroup }: MessageBubbleProps) => {
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <View 
      className={`flex-row ${isOwnGroup ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <View 
        className={`
          max-w-[80%] 
          rounded-xl 
          px-4 
          py-2.5
          ${isOwnGroup ? 'bg-primary' : 'bg-gray-800/50'}
          ${isOwnGroup ? 'rounded-tr-sm' : 'rounded-tl-sm'}
          border
          ${isOwnGroup ? 'border-primary-dark' : 'border-gray-700'}
        `}
      >
        <Text 
          className={`text-xs mb-1 ${isOwnGroup ? 'text-blue-200' : 'text-gray-400'}`}
        >
          {message.senderName}
        </Text>
        <Text className="text-white text-base">
          {message.content}
        </Text>
        <Text 
          className={`text-xs mt-1 ${isOwnGroup ? 'text-blue-200' : 'text-gray-400'}`}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};