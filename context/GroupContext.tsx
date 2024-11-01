import { doc } from 'firebase/firestore';
import { GroupData } from '@/src/firebase/firestore/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import { db } from '@/firebaseConfig';
import { onSnapshot } from 'firebase/firestore';
import { useAuthContext } from './AuthContext';
import { joinGroup, getGroupByInviteCode } from '@/src/firebase/firestore/groups';

type GroupContextType = {
  group: GroupData | null;
  activeGroups: GroupData[];
  handleJoinGroup: (inviteCode: string) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroupContext must be used within a GroupProvider');
  }
  return context;
};

type GroupProviderProps = {
  children: ReactNode;
}

export const GroupProvider = ({ children }: GroupProviderProps) => {
  const [group, setGroup] = useState<GroupData | null>(null);
  const [activeGroups, setActiveGroups] = useState<GroupData[]>([]);
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();
  useEffect(() => {
    if (!user?.currentGroup) {
      setGroup(null);
      return;
    }

    const groupRef = doc(db, 'groups', user.currentGroup);
    const unsubscribeGroup = onSnapshot(
      groupRef,
      { includeMetadataChanges: false },
      (doc) => {
        if (!doc.exists()) {
          return;
        }
        const groupData = doc.data() as GroupData;
        setGroup(groupData);
      },
      (error) => {
        console.error('Group listener error:', error);
      }
    );

    return () => unsubscribeGroup();
  }, [user?.currentGroup]);

  const handleJoinGroup = async (inviteCode: string) => {
    if (!userAuth?.uid) {
      return;
    }

    const targetGroups = await getGroupByInviteCode(inviteCode);
    if (targetGroups.length === 0) {
      throw new Error('Invalid invite code');
    }

    const targetGroup = targetGroups[0];
    await joinGroup(userAuth.uid, targetGroup.id);
  }

  return (
    <GroupContext.Provider value={{ group, activeGroups, handleJoinGroup }}>
      {children}
    </GroupContext.Provider>
  );
};
