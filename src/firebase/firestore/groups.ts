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
  groupData: Omit<GroupData, 'inviteCode' | 'isActive' | 'createdAt' | 'members' >
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
      },
      likes: {},
      passes: {},
      matches: {}
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

export const fetchActiveGroups = async (
  userId: string,
  currentGroupId: string
): Promise<GroupData[]> => {
  try {
    // Get current group's data to check likes/passes/matches
    const currentGroupRef = doc(db, 'groups', currentGroupId);
    const currentGroupDoc = await getDoc(currentGroupRef);
    const currentGroupData = currentGroupDoc.data() as GroupData;

    // Get all active groups
    const q = query(
      collection(db, 'groups'),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    // Filter and transform the data
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GroupData))
      .filter(group => 
        group.id !== currentGroupId && // Not own group
        !group.members[userId] && // Not a member
        !currentGroupData.likes?.[group.id] && // Haven't liked
        !currentGroupData.passes?.[group.id] && // Haven't passed
        !currentGroupData.matches?.[group.id] // Haven't matched
      );
  } catch (error) {
    console.error('Error fetching active groups:', error);
    throw error;
  }
};

export const fetchMatchedGroups = async (groupId: string): Promise<GroupData[]> => {
  try {
    // Get current group to get matches
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    const groupData = groupDoc.data() as GroupData;

    if (!groupData.matches || Object.keys(groupData.matches).length === 0) {
      return [];
    }

    // Get all matched groups data
    const matchedGroupIds = Object.keys(groupData.matches);
    const matchedGroups = await Promise.all(
      matchedGroupIds.map(async (matchedGroupId) => {
        const matchedGroupRef = doc(db, 'groups', matchedGroupId);
        const matchedGroupDoc = await getDoc(matchedGroupRef);
        return {
          id: matchedGroupDoc.id,
          ...matchedGroupDoc.data()
        } as GroupData;
      })
    );

    return matchedGroups;
  } catch (error) {
    console.error('Error fetching matched groups:', error);
    throw error;
  }
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

export const getGroupByCreatorId = async (creatorId: string): Promise<GroupData[]> => {
  try {
    const q = query(collection(db, 'groups'), where('createdBy', '==', creatorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }) as GroupData);
  } catch (error) {
    console.error('Error getting group by creator ID:', error);
    throw error;
  }
};

export const handleLike = async (
  currentGroupId: string, 
  targetGroupId: string
): Promise<boolean> => {  // Returns true if it's a match
  try {
    const batch = writeBatch(db);
    
    // Get both groups
    const currentGroupRef = doc(db, 'groups', currentGroupId);
    const targetGroupRef = doc(db, 'groups', targetGroupId);
    
    // Get target group data to check if they already liked current group
    const targetGroupDoc = await getDoc(targetGroupRef);
    const targetGroupData = targetGroupDoc.data() as GroupData;

    // Store the like
    batch.update(currentGroupRef, {
      [`likes.${targetGroupId}`]: true
    });

    // If target group already liked current group, create match
    if (targetGroupData.likes?.[currentGroupId]) {
      batch.update(currentGroupRef, {
        [`matches.${targetGroupId}`]: true
      });
      batch.update(targetGroupRef, {
        [`matches.${currentGroupId}`]: true
      });
      await batch.commit();
      return true; // It's a match
    }

    // If no match, just save the like
    await batch.commit();
    return false;
  } catch (error) {
    console.error('Error handling like:', error);
    throw error;
  }
};

export const handlePass = async (
  currentGroupId: string, 
  targetGroupId: string
): Promise<void> => {
  try {
    const groupRef = doc(db, 'groups', currentGroupId);
    await updateDoc(groupRef, {
      [`passes.${targetGroupId}`]: true
    });
  } catch (error) {
    console.error('Error handling pass:', error);
    throw error;
  }
};






