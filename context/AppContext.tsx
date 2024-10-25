import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

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

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.replace('/');
    }).catch((error: any) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <AppContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
};
