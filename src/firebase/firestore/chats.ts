import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { ChatData, MessageData } from './types';

export const createChat = async (groupId1: string, groupId2: string): Promise<string> => {
  try {
    const chatId = [groupId1, groupId2].sort().join('_');
    
    const chatRef = doc(db, 'chats', chatId);
    const chatData: Omit<ChatData, 'id'> = {
      groupId1: groupId1,
      groupId2: groupId2,
      createdAt: new Date(),
    };

    await setDoc(chatRef, chatData);
    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};


export const sendMessage = async (
  chatId: string,
  text: string,
  senderId: string,
  senderName: string,
  groupId: string
): Promise<void> => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messageData: Omit<MessageData, 'id'> = {
      content: text,
      senderId,
      senderName,
      groupId,
      timestamp: new Date()
    };

    await addDoc(messagesRef, {
      content: text,
      senderId,
      senderName,
      groupId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getRecentMessages = async (chatId: string, messageLimit = 50): Promise<MessageData[]> => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MessageData));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};


export const getChatData = async (chatId: string): Promise<ChatData | null> => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      return null;
    }

    return {
      id: chatDoc.id,
      ...chatDoc.data()
    } as ChatData;
  } catch (error) {
    console.error('Error getting chat:', error);
    throw error;
  }
};
