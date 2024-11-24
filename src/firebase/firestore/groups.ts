import { collection, doc, writeBatch, query, where, getDocs, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
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

const isValidImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const createFirestoreGroup = async (
  groupData: Omit<GroupData, 'id' | 'inviteCode' | 'isActive' | 'createdAt' | 'members' | 'memberCount'>
) => {
  try {
    const batch = writeBatch(db);
    
    const groupCollectionRef = collection(db, 'groups');
    const newGroupRef = doc(groupCollectionRef);
    
    const groupDoc = {
      ...groupData,
      inviteCode: await generateUniqueInviteCode(),
      isActive: false,
      createdAt: new Date(),
      members: {
        [groupData.createdBy]: true
      },
      likes: {},
      passes: {},
      matches: {},
      memberCount: 1
    };

    batch.set(newGroupRef, groupDoc);

    const userRef = doc(db, 'users', groupData.createdBy);
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
    const currentGroupRef = doc(db, 'groups', currentGroupId);
    const currentGroupDoc = await getDoc(currentGroupRef);
    const currentGroupData = currentGroupDoc.data() as GroupData;

    const q = query(
      collection(db, 'groups'),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GroupData))
      .filter(group => 
        group.id !== currentGroupId && 
        !group.members[userId] && 
        !currentGroupData.likes?.[group.id] && 
        !currentGroupData.passes?.[group.id] && 
        !currentGroupData.matches?.[group.id]
      );
  } catch (error) {
    console.error('Error fetching active groups:', error);
    throw error;
  }
};

export const fetchMatchedGroups = async (groupId: string): Promise<GroupData[]> => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    const groupData = groupDoc.data() as GroupData;

    if (!groupData.matches || Object.keys(groupData.matches).length === 0) {
      return [];
    }

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

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }


    const groupData = groupDoc.data();
    if (groupData.members && groupData.members[userId]) {
      throw new Error('User is already a member of this group');
    }

    batch.update(groupRef, {
      [`members.${userId}`]: true,
      memberCount: groupData.memberCount + 1,
      isActive: true
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
): Promise<boolean> => {
  try {
    const batch = writeBatch(db);
    
    const currentGroupRef = doc(db, 'groups', currentGroupId);
    const targetGroupRef = doc(db, 'groups', targetGroupId);
    
    const targetGroupDoc = await getDoc(targetGroupRef);
    const targetGroupData = targetGroupDoc.data() as GroupData;
    
    batch.update(currentGroupRef, {
      [`likes.${targetGroupId}`]: true
    });


    if (targetGroupData.likes?.[currentGroupId]) {
      batch.update(currentGroupRef, {
        [`matches.${targetGroupId}`]: true
      });
      batch.update(targetGroupRef, {
        [`matches.${currentGroupId}`]: true
      });
      await batch.commit();
      return true; 
    }


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

export const updateGroupPhoto = async (
  groupId: string, 
  photoUrl: string
): Promise<void> => {
  try {
    if (!isValidImageUrl(photoUrl)) {
      throw new Error('Invalid image URL. Please provide a valid HTTP/HTTPS URL.');
    }

    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      photo: photoUrl
    });

  } catch (error) {
    console.error('Error updating group photo:', error);
    throw error;
  }
};

type UpdateGroupInfoData = {
  name?: string;
  description?: string;
};

export const updateGroupInfo = async (
  groupId: string, 
  data: UpdateGroupInfoData
): Promise<void> => {
  try {
    if (data.name !== undefined && data.name.trim().length < 1) {
      throw new Error('Group name cannot be empty');
    }

    const cleanData: UpdateGroupInfoData = {};
    
    if (data.name !== undefined) {
      cleanData.name = data.name.trim();
    }
    
    if (data.description !== undefined) {
      cleanData.description = data.description.trim();
    }

    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, cleanData);

  } catch (error) {
    console.error('Error updating group info:', error);
    throw error;
  }
};


export const leaveGroup = async (groupId: string, userId: string): Promise<void> => {
  try {;
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupSnap.data();
    
    const updatedMembers = { ...groupData.members };
    delete updatedMembers[userId];

    await updateDoc(groupRef, {
      members: updatedMembers,
      memberCount: groupData.memberCount - 1,
      isActive: (groupData.memberCount - 1) > 1, 
    });

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      currentGroup: null
    });

  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};


export const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupSnap.data();
    
    const memberIds = Object.keys(groupData.members);
    await Promise.all(
      memberIds.map(memberId => 
        updateDoc(doc(db, 'users', memberId), {
          currentGroup: null
        })
      )
    );

    if (groupData.matches && Object.keys(groupData.matches).length > 0) {
      await Promise.all(
        Object.keys(groupData.matches).map(async (matchedGroupId) => {
          const matchedGroupRef = doc(db, 'groups', matchedGroupId);
          const matchedGroupSnap = await getDoc(matchedGroupRef);
          
          if (matchedGroupSnap.exists()) {
            const matchedGroupData = matchedGroupSnap.data();
            const updatedMatches = { ...matchedGroupData.matches };
            delete updatedMatches[groupId];
            
            await updateDoc(matchedGroupRef, {
              matches: updatedMatches
            });
          }
        })
      );
    }

    const chatsQuery1 = query(
      collection(db, 'chats'),
      where('groupId1', '==', groupId)
    );
    const chatsQuery2 = query(
      collection(db, 'chats'),
      where('groupId2', '==', groupId)
    );

    const [chatsSnapshot1, chatsSnapshot2] = await Promise.all([
      getDocs(chatsQuery1),
      getDocs(chatsQuery2)
    ]);

    await Promise.all([
      ...chatsSnapshot1.docs,
      ...chatsSnapshot2.docs
    ].map(chatDoc => deleteDoc(chatDoc.ref)));

    await deleteDoc(groupRef);

  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }



};