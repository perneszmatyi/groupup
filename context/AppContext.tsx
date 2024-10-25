import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
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
    const [user, setUser] = useState<User | null>(null);
  
    // Keeps track of the current user's auth state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleLogout = () => signOut(auth);
  
    return (
      <AppContext.Provider value={{ user, setUser, handleLogout }}>
        {children}
      </AppContext.Provider>
    );
  };
