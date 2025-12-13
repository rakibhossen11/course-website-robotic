'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  getIdToken,
} from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        
        // Store token in cookie for API calls
        const token = await getIdToken(firebaseUser);
        document.cookie = `firebase-token=${token}; path=/`;
        
        // Sync user to your backend (MongoDB)
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            image: firebaseUser.photoURL,
          }),
        });
      } else {
        setUser(null);
        document.cookie = 'firebase-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      console.log(provider);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    googleSignIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}