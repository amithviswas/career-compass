"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { auth } from '@/lib/firebase'; // Uncomment when Firebase is fully configured
// import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Uncomment

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User | null>; // Simplified, replace with actual Firebase signIn
  signUp: (email: string, pass: string) => Promise<User | null>; // Simplified, replace with actual Firebase signUp
  signOut: () => Promise<void>; // Simplified, replace with actual Firebase signOut
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a mock auth state persistence. Replace with actual Firebase onAuthStateChanged
    const mockUser = localStorage.getItem('careerCompassUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
    setLoading(false);

    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    //   if (firebaseUser) {
    //     setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName });
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  // Mock sign-in function
  const signIn = async (email: string, _pass: string): Promise<User | null> => {
    setLoading(true);
    // Replace with: await signInWithEmailAndPassword(auth, email, pass);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { uid: 'mock-uid-' + Date.now(), email, displayName: email.split('@')[0] };
        setUser(mockUser);
        localStorage.setItem('careerCompassUser', JSON.stringify(mockUser));
        setLoading(false);
        resolve(mockUser);
      }, 1000);
    });
  };
  
  // Mock sign-up function
  const signUp = async (email: string, _pass: string): Promise<User | null> => {
    setLoading(true);
    // Replace with: await createUserWithEmailAndPassword(auth, email, pass);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { uid: 'mock-uid-' + Date.now(), email, displayName: email.split('@')[0] };
        setUser(mockUser);
        localStorage.setItem('careerCompassUser', JSON.stringify(mockUser));
        setLoading(false);
        resolve(mockUser);
      }, 1000);
    });
  };

  // Mock sign-out function
  const signOut = async () => {
    setLoading(true);
    // Replace with: await firebaseSignOut(auth);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem('careerCompassUser');
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
