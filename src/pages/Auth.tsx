import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../auth/AuthProvider';
import { useHistory } from '../components/Router';
import googleIcon from '../assets/google.png'

const Auth = () => {
  const { setIsAuthenticated } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Already signed in — redirect immediately
      setIsAuthenticated(true);
      history.push('/');
      return;
    }

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
    <div className='flex w-screen h-screen gap-10 flex-col items-center justify-center text-white'>
      <div className='aspect-[5/3] w-100 sm:w-120 lg:w-130 bg-[#1d1d1d] flex flex-col items-center justify-evenly rounded-md outline outline-[#2d2d2d]'>
        <div className='w-[80%] justify-start flex gap-2 items-center'>
          <img
            src='/logo.png'
            alt='logo'
            width={40}
            height={40}
            className='w-10 h-auto object-contain'
          />
          <h1 className='text-xl'>VirtuSense</h1>
        </div>
        <p className='text-white text-xl font-bold'>Sign in to Continue</p>
        <div
          className='flex justify-center items-center gap-4 hover:bg-[#165b53] bg-[#1a7368] text-lg w-[80%] p-3 rounded-md cursor-pointer'
          onClick={handleGoogleLogin}
        >
          <img
            src={googleIcon}
            alt="logo"
            width={40}
            height={40}
            className='w-7 h-auto object-contain'
          />
          <p>{user ? `Continue as ${user.displayName}` : 'Sign In'}</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;