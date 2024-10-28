import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { UserData } from './types';

export const createFirestoreUser = async (
  uid: string, 
  userData: Omit<UserData, 'createdAt' | 'currentGroup' | 'lastActive'>
) => {
  try {
    const userDoc = {
      ...userData,
      createdAt: new Date(),
      currentGroup: null,  
      lastActive: new Date(),
    };

    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, userDoc);
    console.log('User document created successfully');
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log('No such user document!'); 
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

