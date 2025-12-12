import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useHistory, useLocation } from '../components/Router';
import googleIcon from '../assets/google.png'
import virtuSense from '../assets/logo.png'
import Toast from '../../react-native-toast-message';
import PrivacyPolicyModal from '../components/modals/PrivacyPolicyModalProps';
import TermsOfServiceModal from '../components/modals/TermsOfServiceModalProps';

const Auth = () => {
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const [user, setUser] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Check auth state every 3 seconds
  useEffect(() => {
    const checkAuthState = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const returnUrl = location.state?.from || '/';
        history.push(returnUrl);
      }
    };

    // Initial check
    checkAuthState();

    // Set up interval to check every 3 seconds
    const interval = setInterval(checkAuthState, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [location, history]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    if (!agreedToTerms) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: 'Agreement Required',
        text2: 'Please agree to the Terms of Service and Privacy Policy to continue.',
        visibilityTime: 3000,
      });
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      const returnUrl = location.state?.from || '/';
      history.push(returnUrl);
      return;
    }

    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        Toast.show({
          leadingIconName: 'tick-fill',
          type: 'success',
          text1: `Welcome, ${result?.user?.displayName}!`,
          text2: `You're now logged in.`,
          visibilityTime: 3000,
        });
        const returnUrl = location.state?.from || '/';
        history.push(returnUrl);
      }
    } catch (error) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: 'Sign-in Failed',
        text2: 'Something went wrong. Please try again in default browsers.',
        visibilityTime: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  return (
    <div className='flex w-screen h-screen gap-10 flex-col items-center justify-center text-white bg-[#1c1c1b]'>
      <div className='sm:aspect-5/3 p-2 h-60 sm:h-auto w-9/10 sm:w-120 lg:w-130 bg-[#1d1d1d] flex flex-col items-center justify-evenly rounded-md outline outline-[#2d2d2d]'>
        <div className='w-[80%] justify-start flex gap-2 items-center mt-4'>
          <img
            src={virtuSense}
            alt='logo'
            className='w-8 h-auto object-contain'
          />
          <h1 className='text-xl'>VirtuSense</h1>
        </div>
        <p className='text-white text-lg font-bold my-4'>
          {user ? 'Welcome Back' : 'Sign in to Continue'}
        </p>
        <div
          className={`flex justify-center items-center gap-4 ${
            agreedToTerms && !isLoading
              ? 'hover:bg-[#165b53] bg-[#1a7368] cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-base md:text-lg w-[80%] p-3 rounded-md transition-colors`}
          onClick={handleGoogleLogin}
        >
          {isLoading ? (
            <>
              <p className='truncate'>Signing in...</p>
            </>
          ) : (
            <>
              <img
                src={googleIcon}
                alt="logo"
                className='w-5 h-auto object-contain'
              />
              <p className='truncate'>{user ? `Continue as ${user.displayName}` : 'Sign In'}</p>
            </>
          )}
        </div>

        <div className="w-10/12 mx-auto text-xs flex flex-col items-center gap-3 py-4">
          <label className="flex gap-2 cursor-pointer items-center">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-3 h-3 cursor-pointer accent-[#1a7368]"
              disabled={isLoading}
            />
            <span className="text-left">
              I agree to the{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
              >
                Terms of Service
              </span>{' '}
              and{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
              >
                Privacy Policy
              </span>
            </span>
          </label>

          <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
          <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
      </div>
      <p className="text-[0.65rem] text-gray-400 text-center">
        © {new Date().getFullYear()} VirtuSense. All rights reserved.
      </p>
    </div>
  );
};

export default Auth;