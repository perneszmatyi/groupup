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
      className={`flex-row ${isOwnGroup ? 'justify-end' : 'justify-start'} mb-3 mx-4`}
    >
      <View 
        className={`
          max-w-[80%] 
          rounded-2xl 
          px-4 
          py-2.5
          ${isOwnGroup ? 'bg-primary' : 'bg-white'}
          ${isOwnGroup ? 'rounded-tr-sm' : 'rounded-tl-sm'}
          shadow-sm
        `}
      >
        <Text 
          className={`text-xs mb-1 ${isOwnGroup ? 'text-primary-light' : 'text-neutral-body'}`}
        >
          {message.senderName}
        </Text>
        <Text className={`${isOwnGroup ? 'text-white' : 'text-neutral-text'} text-base`}>
          {message.content}
        </Text>
        <Text 
          className={`text-xs mt-1 ${isOwnGroup ? 'text-primary-light' : 'text-neutral-body'}`}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};