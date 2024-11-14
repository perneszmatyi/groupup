import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
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
    <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
      <TextInput
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        multiline
        maxLength={500}
      />
      <TouchableOpacity 
        onPress={handleSend}
        disabled={!message.trim() || isSending}
        className={`
          p-2 
          rounded-full 
          ${(!message.trim() || isSending) ? 'bg-gray-300' : 'bg-blue-500'}
        `}
      >
        <Ionicons 
          name="send" 
          size={24} 
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};