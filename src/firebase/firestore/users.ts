import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { UserData } from './types';
import { deleteGroup } from './groups';
import { leaveGroup } from './groups';
import { deleteUser } from 'firebase/auth';

export const createFirestoreUser = async (
  uid: string, 
  userData: Omit<UserData, 'createdAt' | 'currentGroup' | 'lastActive'>
) => {
  try {
    const userDoc = {
      ...userData,
      id: uid,
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


type UpdateUserProfileData = {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
};

export const updateUserProfile = async (
  userId: string, 
  data: UpdateUserProfileData
): Promise<void> => {
  try {
    if (data.firstName !== undefined && data.firstName.trim().length < 1) {
      throw new Error('First name cannot be empty');
    }
    if (data.lastName !== undefined && data.lastName.trim().length < 1) {
      throw new Error('Last name cannot be empty');
    }
    if (data.profilePicture !== undefined) {
      try { 
        new URL(data.profilePicture);
      } catch {
        throw new Error('Invalid profile picture URL');
      }
    }


    const cleanData: UpdateUserProfileData = {};
    if (data.firstName !== undefined) {
      cleanData.firstName = data.firstName.trim();
    }
    if (data.lastName !== undefined) {
      cleanData.lastName = data.lastName.trim();
    }
    if (data.profilePicture !== undefined) {
      cleanData.profilePicture = data.profilePicture;
    }


    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, cleanData);

  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();


    if (userData.currentGroup) {
      const groupRef = doc(db, 'groups', userData.currentGroup);
      const groupSnap = await getDoc(groupRef);
      
      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        

        if (groupData.createdBy === userId) {
          await deleteGroup(userData.currentGroup);
        } else {

          await leaveGroup(userData.currentGroup, userId);
        }
      }
    }


    await deleteDoc(userRef);


    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
    }

  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};