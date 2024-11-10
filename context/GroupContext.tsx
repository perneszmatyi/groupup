import { doc, query, collection, where } from 'firebase/firestore';
import { GroupData } from '@/src/firebase/firestore/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import { db } from '@/firebaseConfig';
import { onSnapshot } from 'firebase/firestore';
import { fetchActiveGroups } from '@/src/firebase/firestore/groups';
import { useAuthContext } from './AuthContext';
import { joinGroup, getGroupByInviteCode } from '@/src/firebase/firestore/groups';

type GroupContextState = {
  currentGroup: GroupData | null;
  availableGroups: GroupData[];
  isLoading: boolean;
  error: string | null;
}

type GroupContextType = GroupContextState & {
  handleJoinGroup: (inviteCode: string) => Promise<void>;
  refreshGroups: () => Promise<void>;
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
  const [currentGroup, setCurrentGroup] = useState<GroupData | null>(null);
  const [availableGroups, setAvailableGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();

  // Listen to current group
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (!user?.currentGroup) {
      setCurrentGroup(null);
      setIsLoading(false);
      return;
    }

    const groupRef = doc(db, 'groups', user.currentGroup);
    const unsubscribeGroup = onSnapshot(
      groupRef,
      { includeMetadataChanges: false },
      (doc) => {
        if (!doc.exists()) {
          setError('Group not found');
          setCurrentGroup(null);
          return;
        }
        
        const groupData = { id: doc.id, ...doc.data() } as GroupData; // doc data doesn't include id by default
        
        // Validate group is still active
        if (!groupData.isActive) {
          setError('Group is no longer active');
          setCurrentGroup(null);
          return;
        }

        setCurrentGroup(groupData);
        setError(null);
      },
      (error) => {
        console.error('Group listener error:', error);
        setError(error.message);
        setCurrentGroup(null);
      }
    );

    setIsLoading(false);
    return () => unsubscribeGroup();
  }, [user?.currentGroup]);

  // Fetch available groups
  const loadAvailableGroups = async () => {
    if (!userAuth?.uid) {
      setAvailableGroups([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const groups = await fetchActiveGroups(userAuth.uid);
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error fetching active groups:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch groups');
      setAvailableGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load available groups on auth change
  useEffect(() => {
    loadAvailableGroups();
  }, [userAuth?.uid]);

  const handleJoinGroup = async (inviteCode: string) => {
    if (!userAuth?.uid) {
      throw new Error('User must be authenticated to join a group');
    }

    try {
      const targetGroups = await getGroupByInviteCode(inviteCode);
      if (targetGroups.length === 0) {
        throw new Error('Invalid invite code');
      }

      const targetGroup = targetGroups[0] as GroupData;
      
      // Validate group is active
      if (!targetGroup.isActive) {
        throw new Error('This group is no longer active');
      }

      await joinGroup(userAuth.uid, targetGroup.id);
      await loadAvailableGroups(); // Refresh available groups after joining
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  return (
    <GroupContext.Provider value={{ 
      currentGroup, 
      availableGroups, 
      isLoading,
      error,
      handleJoinGroup,
      refreshGroups: loadAvailableGroups
    }}>
      {children}
    </GroupContext.Provider>
  );
};
