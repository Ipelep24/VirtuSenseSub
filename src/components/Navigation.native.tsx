import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {useHistory} from './Router.native';
import {BackButton} from './Router.native';

const processUrl = (url: string): string => {
  return url
    .replace(`${$config.PRODUCT_ID.toLowerCase()}://my-host`, '')
    .replace($config.FRONTEND_ENDPOINT, '');
};

const Navigation = () => {
  //moved deeplink handling into AuthProvider
  return (
    <>
      <BackButton />
    </>
  );
};

export default Navigation;
