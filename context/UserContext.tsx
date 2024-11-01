import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getUserData } from '@/src/firebase/firestore/users';
import { GroupData, UserData } from '@/src/firebase/firestore/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuthContext } from './AuthContext';
import { useEffect } from 'react';

type UserContextType = {
  user: UserData | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

type UserProviderProps = {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { userAuth } = useAuthContext();

  useEffect(() => {
    if (!userAuth) {
      setUser(null);
      return;
    }

    const setupUserListener = async () => {
      try {
        const userData = await getUserData(userAuth.uid);
        setUser(userData);

        const userRef = doc(db, 'users', userAuth.uid);
        const unsubscribeUser = onSnapshot(
          userRef,
          { includeMetadataChanges: false },
          (doc) => {
            if (!doc.exists()) {
              return;
            }
            const newData = doc.data() as UserData;
            setUser(newData);
          },
          (error) => {
            console.error('User listener error:', error);
          }
        );

        return () => {
          unsubscribeUser();
        };
      } catch (error) {
        console.error('Error in user data setup:', error);
        setUser(null);
      }
    };

    setupUserListener();
  }, [userAuth]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}; 