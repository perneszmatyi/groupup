import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  userAuth: User | null;
  setUserAuth: (user: User | null) => void;
  authLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUserAuth(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const authLogout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      userAuth, 
      setUserAuth, 
      authLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 