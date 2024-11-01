import { collection, doc, writeBatch, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { GroupData } from './types';

const generateUniqueInviteCode = async () => {
  let isUnique = false;
  let inviteCode = '';

  while (!isUnique) {
    inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const q = query(
      collection(db, 'groups'),
      where('inviteCode', '==', inviteCode)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      isUnique = true;
    }
  }
  return inviteCode;
};

export const createFirestoreGroup = async (
  groupData: Omit<GroupData, 'inviteCode' | 'isActive' | 'createdAt' | 'members'>
) => {
  try {
    const batch = writeBatch(db);
    
    const groupCollectionRef = collection(db, 'groups'); //gets the collection
    const newGroupRef = doc(groupCollectionRef); //gets the document
    
    const groupDoc = {
      ...groupData,
      inviteCode: await generateUniqueInviteCode(),
      isActive: true,
      createdAt: new Date(),
      members: {
        [groupData.createdBy]: true
      }
    };

    batch.set(newGroupRef, groupDoc);

    const userRef = doc(db, 'users', groupData.createdBy); //gets document
    batch.update(userRef, {
      currentGroup: newGroupRef.id
    });

    await batch.commit();
    
    console.log('Group created successfully with ID:', newGroupRef.id);
    return newGroupRef.id;

  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};


export const fetchActiveGroups = async (userId: string) => {
  const q = query(
    collection(db, 'groups'),
    where('isActive', '==', true),
    where(`members.${userId}`, '==', null)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};


export const getGroupByInviteCode = async (inviteCode: string) => {
  try {
    if (!inviteCode) {
      throw new Error('Invite code is required');
    }

    const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting group by invite code:', error);
    throw error;
  }
};

export const joinGroup = async (userId: string, groupId: string) => {
  try {
    if (!userId || !groupId) {
      throw new Error('User ID and Group ID are required');
    }

    const batch = writeBatch(db);
    
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    // Verify user exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Check if user is already in group
    const groupData = groupDoc.data();
    if (groupData.members && groupData.members[userId]) {
      throw new Error('User is already a member of this group');
    }

    batch.update(groupRef, {
      [`members.${userId}`]: true
    });

    batch.update(userRef, {
      currentGroup: groupId
    });

    await batch.commit();
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

export const getGroupByCreatorId = async (creatorId: string) => {
  const q = query(collection(db, 'groups'), where('createdBy', '==', creatorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};