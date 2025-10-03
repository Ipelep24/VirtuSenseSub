import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'
import { useAuth } from '../auth/AuthProvider';
import { useHistory } from '../components/Router';
import { Button, View, Text } from 'react-native';

const Auth = () => {
  const { setIsAuthenticated } = useAuth();
  const history = useHistory();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        setIsAuthenticated(true);
        history.push('/');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div className='flex w-screen h-screen gap-10 flex-col items-center justify-center'>
      <p className='text-white'>Sign in with Google</p>
      <button 
      className='bg-blue-500 text-white w-[95%] p-3' 
      onClick={handleGoogleLogin}>Sign In</button>
    </div>
  );
};

export default Auth;