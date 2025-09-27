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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Sign in with Google</Text>
      <Button title="Sign In" onPress={handleGoogleLogin} />
    </View>
  );
};

export default Auth;