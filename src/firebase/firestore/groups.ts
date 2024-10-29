import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
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