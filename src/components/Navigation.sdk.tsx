import React, {useEffect, useContext} from 'react';
import {SdkApiContext} from './SdkApiContext';
import {useHistory} from './Router';
import isSDK from '../utils/isSDK';

const Navigation = () => {
  const {join: SdkJoinState} = useContext(SdkApiContext);

  const history = useHistory();

  useEffect(() => {
    if (isSDK() && SdkJoinState.initialized) {
      if (SdkJoinState.phrase) {
        history.push(`/${SdkJoinState.phrase}`);
      }
    }
  }, [SdkJoinState]);
  return <></>;
};

export default Navigation;
