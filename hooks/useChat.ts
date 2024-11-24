import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { MessageData, ChatData } from '@/src/firebase/firestore/types';
import { sendMessage, getRecentMessages } from '@/src/firebase/firestore/chats';
import { useUserContext } from '@/context/UserContext';
import { useAuthContext } from '@/context/AuthContext';
import { useGroupContext } from '@/context/GroupContext';

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentGroup } = useGroupContext(); 
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();




  useEffect(() => {
    setIsLoading(true);
    
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as MessageData);
        
        setMessages(newMessages.reverse()); // Show oldest first
        setIsLoading(false);
        setError(null);
      }, (error) => {
        console.error('Chat listener error:', error);
        setError('Failed to load messages');
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up chat listener:', error);
      setError('Failed to set up chat');
      setIsLoading(false);
    }
  }, [chatId]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!userAuth || !currentGroup) return;
    
    try {
      await sendMessage(
        chatId,
        text,
        userAuth.uid,
        `${user?.firstName} ${user?.lastName}`,
        currentGroup.id
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  }, [chatId, user, currentGroup]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage
  };
}; 