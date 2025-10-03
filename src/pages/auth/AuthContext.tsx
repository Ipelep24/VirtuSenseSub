import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import type { User } from 'firebase/auth';

interface AuthContextType {
  googleUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ googleUser: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setGoogleUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ googleUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);