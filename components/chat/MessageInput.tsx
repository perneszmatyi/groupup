import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MessageInputProps = {
  onSend: (text: string) => Promise<void>;
};

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View className="flex-row items-center p-3 border-t border-neutral-light bg-white">
      <TextInput
        className="flex-1 bg-neutral-lighter rounded-full px-4 py-2.5 mr-2 text-neutral-text"
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor="#9CA3AF"
        multiline
        maxLength={500}
      />
      <TouchableOpacity 
        onPress={handleSend}
        disabled={!message.trim() || isSending}
        className={`
          w-10 
          h-10 
          rounded-full 
          items-center 
          justify-center
          ${(!message.trim() || isSending) ? 'bg-neutral-light' : 'bg-primary'}
        `}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons 
            name="send" 
            size={20} 
            color={!message.trim() ? '#9CA3AF' : 'white'} 
          />
        )}
      </TouchableOpacity>
    </View>
  );
};