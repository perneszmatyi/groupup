import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '@/src/firebase/firestore/users';
import { UserData } from '@/src/firebase/firestore/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

type AppContextType = {
  userAuth: User | null;
  user: UserData | null;
  setUserAuth: (user: User | null) => void;
  handleLogout: () => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);


// Custome hook for safer access to the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

type AppProviderProps = {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [userAuth, setUserAuth] = useState<User | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUserAuth(firebaseUser);
        
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        try {
          const userData = await getUserData(firebaseUser.uid);
          setUser(userData);

          const userRef = doc(db, 'users', firebaseUser.uid);
          const unsubscribeUser = onSnapshot(
            userRef,
            { includeMetadataChanges: false },
            (doc) => {
              if (!doc.exists()) {
                return;
              }
              
              const newData = doc.data() as UserData;
              setUser(prev => {
                if (JSON.stringify(prev) === JSON.stringify(newData)) {
                  return prev;
                }
                return newData;
              });
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
      });
  
      return () => unsubscribe();
    }, []);

    const handleLogout = () => signOut(auth);

  
    return (
      <AppContext.Provider value={{ 
        userAuth, 
        user, 
        setUserAuth, 
        handleLogout,

      }}>
        {children}
      </AppContext.Provider>
    );
  };
