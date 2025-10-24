import React, { useEffect, useRef, useState } from 'react';
import { Route, Redirect } from '../components/Router';
import Toast from '../../react-native-toast-message';
import type { RouteProps } from 'react-router';
import { auth } from '../firebase'; // ⬅️ Firebase instance
import isSDK from '../utils/isSDK';
import Loading from '../subComponents/Loading';
import { useString } from '../utils/useString';
import {
  authAuthenticationFailedText,
  loadingText,
  logoutText,
} from '../language/default-labels/commonLabels';

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<PrivateRouteProps> = props => {
  const didMountRef = useRef(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const loadingLabel = useString(loadingText)();
  const logout = useString(logoutText)();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      if (didMountRef.current && !user) {
        Toast.show({
          leadingIconName: 'info',
          type: 'info',
          text1: logout,
          text2: 'You have successfully logged out.',
          visibilityTime: 2000,
        });
      }
      didMountRef.current = true;
    });

    return () => unsubscribe();
  }, []);

  if (isSDK()) {
    return <Route {...props} />;
  }

  if (isSignedIn === null) {
    return <Loading text={loadingLabel} />;
  }

  return isSignedIn ? (
    <Route {...props} />
  ) : (
    <Redirect to="/auth" />
  );
};

export default AuthRoute;