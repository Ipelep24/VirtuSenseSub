import {DispatchContext, RtcContext} from '../../agora-rn-uikit';
import {useContext} from 'react';
import {isWeb} from './common';

function useLocalVideo() {
  const {dispatch} = useContext(DispatchContext);
  const {RtcEngineUnsafe} = useContext(RtcContext);

  const disableVideoButton = () => {
    RtcEngineUnsafe.muteLocalVideoStream(true);
    dispatch({
      type: 'LocalMuteVideo',
      value: [0, true],
    });
  };

  const enableVideoButton = () => {
    dispatch({
      type: 'LocalMuteVideo',
      value: [0, false],
    });
  };

  const getLocalVideoStream = () => {
    try {
      return isWeb() ? window?.engine?.localStream?.video : null;
    } catch (error) {
      throw error;
    }
  };

  const getRemoteVideoStream = (uid: number) => {
    try {
      return isWeb() ? window?.engine?.remoteStreams?.get(uid)?.video : null;
    } catch (error) {
      throw error;
    }
  };

  const getLocalScreenshareVideoStream = () => {
    try {
      return isWeb() ? window?.engine?.screenStream?.video : null;
    } catch (error) {
      throw error;
    }
  };

  return {
    enableVideoButton,
    disableVideoButton,
    getLocalVideoStream,
    getRemoteVideoStream,
    getLocalScreenshareVideoStream,
  };
}

export default useLocalVideo;
