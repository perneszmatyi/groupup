import { doc, query, collection, where } from 'firebase/firestore';
import { GroupData } from '@/src/firebase/firestore/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import { db } from '@/firebaseConfig';
import { onSnapshot } from 'firebase/firestore';
import { deleteGroup, fetchActiveGroups, fetchMatchedGroups } from '@/src/firebase/firestore/groups';
import { useAuthContext } from './AuthContext';
import { joinGroup, getGroupByInviteCode } from '@/src/firebase/firestore/groups';

type GroupContextState = {
  currentGroup: GroupData | null;
  availableGroups: GroupData[];
  matchedGroups: GroupData[];
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
  const [matchedGroups, setMatchedGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();



  const loadAvailableGroups = async () => {
    if (!userAuth?.uid || !user?.currentGroup) {
      setAvailableGroups([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const groups = await fetchActiveGroups(userAuth.uid, user.currentGroup);
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error fetching active groups:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch groups');
      setAvailableGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      

      await joinGroup(userAuth.uid, targetGroup.id);
      await loadAvailableGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  const checkAndDeleteOldGroups = async () => {
    if (!currentGroup) return;
  
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24);
  
      if (currentGroup.createdAt < cutoffTime) {
        if (userAuth?.uid === currentGroup.createdBy) {
          await deleteGroup(currentGroup.id);
        }
      }
    } catch (error) {
      console.error('Error checking group age:', error);
    }
  };


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
        
        const groupData = { id: doc.id, ...doc.data() } as GroupData; 

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


  useEffect(() => {
    loadAvailableGroups();
  }, [userAuth?.uid, currentGroup?.id]);

  
  useEffect(() => {
    const loadMatchedGroups = async () => {
      if (!currentGroup?.id) {
        setMatchedGroups([]);
        return;
      }

      try {
        const groups = await fetchMatchedGroups(currentGroup.id);
        setMatchedGroups(groups);
      } catch (error) {
        console.error('Error loading matched groups:', error);
      }
    };

    loadMatchedGroups();
  }, [currentGroup?.id]);

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
      async (doc) => {
        if (!doc.exists()) {
          setError('Group not found');
          setCurrentGroup(null);
          return;
        }
        
        const groupData = { id: doc.id, ...doc.data() } as GroupData; 
        

        await checkAndDeleteOldGroups();
  
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
  

  return (
    <GroupContext.Provider value={{ 
      currentGroup, 
      availableGroups, 
      matchedGroups,
      isLoading,
      error,
      handleJoinGroup,
      refreshGroups: loadAvailableGroups
    }}>
      {children}
    </GroupContext.Provider>
  );
};
