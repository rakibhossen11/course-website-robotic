'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // MongoDB user data
  const [loading, setLoading] = useState(true);
  console.log(user);

  // Function to get MongoDB user data
  const fetchUserFromMongoDB = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      // Get Firebase token
      const token = await firebaseUser.getIdToken();
      
      // Call your API to get/sync user data with MongoDB
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          image: firebaseUser.photoURL,
          provider: 'google',
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.user; // This contains role from MongoDB
      }
      return null;
    } catch (error) {
      console.error('Error fetching user from MongoDB:', error);
      return null;
    }
  };

  // Function to get user profile from MongoDB
  const getUserProfile = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      const token = await firebaseUser.getIdToken();
      
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // Basic Firebase user data
        const firebaseUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          provider: firebaseUser.providerData?.[0]?.providerId || 'google',
        };

        // Get MongoDB user data (including role)
        const mongoUserData = await fetchUserFromMongoDB(firebaseUser);
        
        // Combine both data sources
        const combinedUser = {
          ...firebaseUserData,
          ...mongoUserData,
          // Ensure role exists (default to 'student')
          role: mongoUserData?.role || 'student',
          // Ensure other MongoDB fields exist
          _id: mongoUserData?._id,
          enrolledCourses: mongoUserData?.enrolledCourses || [],
          createdAt: mongoUserData?.createdAt,
          lastLogin: mongoUserData?.lastLogin || new Date(),
        };

        setUser(combinedUser);
        setDbUser(mongoUserData);
      } else {
        setUser(null);
        setDbUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Sync with MongoDB immediately after login
      const mongoUserData = await fetchUserFromMongoDB(firebaseUser);
      
      const combinedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        provider: 'google',
        ...mongoUserData,
        role: mongoUserData?.role || 'student',
      };

      setUser(combinedUser);
      setDbUser(mongoUserData);
      
      return { 
        success: true, 
        user: combinedUser
      };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  };

  // Refresh user data from MongoDB
  const refreshUserData = async () => {
    if (!auth.currentUser) return null;
    
    setLoading(true);
    const mongoUserData = await getUserProfile(auth.currentUser);
    
    if (mongoUserData && user) {
      const updatedUser = {
        ...user,
        ...mongoUserData,
        role: mongoUserData.role || user.role,
      };
      setUser(updatedUser);
      setDbUser(mongoUserData);
    }
    
    setLoading(false);
    return mongoUserData;
  };

  // Helper functions to check user role
  const isAdmin = () => user?.role === 'admin';
  const isStudent = () => user?.role === 'student';
  const isTeacher = () => user?.role === 'teacher';
  const isUser = () => user?.role === 'user' || user?.role === 'student'; // Adjust as needed
  
  // Get user role with display name
  const getUserRole = () => {
    if (!user?.role) return 'Guest';
    
    const roleMap = {
      'admin': 'Administrator',
      'student': 'Student',
      'teacher': 'Teacher',
      'user': 'User'
    };
    
    return roleMap[user.role] || user.role;
  };

  return (
    <AuthContext.Provider value={{ 
      user,           // Combined user data (Firebase + MongoDB)
      dbUser,         // Raw MongoDB user data
      googleSignIn, 
      logout, 
      loading,
      refreshUserData,
      
      // Role check functions
      isAdmin,
      isStudent,
      isTeacher,
      isUser,
      getUserRole,
      
      // Quick access to common properties
      userRole: user?.role,
      userId: user?._id || user?.uid,
      userName: user?.displayName || user?.name,
      userEmail: user?.email,
      userImage: user?.photoURL || user?.image,
      enrolledCourses: user?.enrolledCourses || [],
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from '@/lib/firebase';
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   onAuthStateChanged
// } from 'firebase/auth';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [dbUser, setDbUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser({
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const googleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       // Return the result so login page can use it
//       return { 
//         success: true, 
//         user: {
//           uid: result.user.uid,
//           email: result.user.email,
//           displayName: result.user.displayName,
//           photoURL: result.user.photoURL,
//         }
//       };
//     } catch (error) {
//       console.error("Error signing in with Google:", error);
//       // Return error object
//       return { 
//         success: false, 
//         error: error.message,
//         code: error.code 
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       return { success: true };
//     } catch (error) {
//       console.error("Error signing out:", error);
//       return { success: false, error: error.message };
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, googleSignIn, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);