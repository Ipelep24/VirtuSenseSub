// @ts-nocheck
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  RtcConfigure,
  PropsProvider,
  ClientRoleType,
  ChannelProfileType,
  LocalUserContext,
  UidType,
  CallbacksInterface,
} from '../../agora-rn-uikit';
import styles from '../components/styles';
import { useParams, useHistory } from '../components/Router';
import RtmConfigure from '../components/RTMConfigure';
import DeviceConfigure from '../components/DeviceConfigure';
import Logo from '../subComponents/Logo';
import { useHasBrandLogo, isMobileUA, isWebInternal } from '../utils/common';
import theme from '../../theme.json';
import { LiveStreamContextProvider } from '../components/livestream';
import ScreenshareConfigure from '../subComponents/screenshare/ScreenshareConfigure';
import { ErrorContext } from '.././components/common/index';
import { PreCallProvider } from '../components/precall/usePreCall';
import { LayoutProvider } from '../utils/useLayout';
import Precall from '../components/Precall';
import { RecordingProvider } from '../subComponents/recording/useRecording';
import useJoinRoom from '../utils/useJoinRoom';
import {
  useRoomInfo,
  RoomInfoDefaultValue,
  WaitingRoomStatus,
} from '../components/room-info/useRoomInfo';
import { SidePanelProvider } from '../utils/useSidePanel';
import { NetworkQualityProvider } from '../components/NetworkQualityContext';
import { ChatNotificationProvider } from '../components/chat-notification/useChatNotification';
import { ChatUIControlsProvider } from '../components/chat-ui/useChatUIControls';
import { ScreenShareProvider } from '../components/contexts/ScreenShareContext';
import { LiveStreamDataProvider } from '../components/contexts/LiveStreamDataContext';
import { useVideoMeetingData, VideoMeetingDataProvider } from '../components/contexts/VideoMeetingDataContext';
import { useWakeLock } from '../components/useWakeLock';
import SDKEvents from '../utils/SdkEvents';
import { UserPreferenceProvider } from '../components/useUserPreference';
import EventsConfigure from '../components/EventsConfigure';
import PermissionHelper from '../components/precall/PermissionHelper';
import { FocusProvider } from '../utils/useFocus';
import { VideoCallProvider } from '../components/useVideoCall';
import { SdkApiContext } from '../components/SdkApiContext';
import isSDK from '../utils/isSDK';
import { CaptionProvider } from '../subComponents/caption/useCaption';
import SdkMuteToggleListener from '../components/SdkMuteToggleListener';
import StorageContext from '../components/StorageContext';
import { useSetRoomInfo } from '../components/room-info/useSetRoomInfo';
import { NoiseSupressionProvider } from '../app-state/useNoiseSupression';
import { VideoQualityContextProvider } from '../app-state/useVideoQuality';
import { VBProvider } from '../components/virtual-background/useVB';
import { DisableChatProvider } from '../components/disable-chat/useDisableChat';
import { WaitingRoomProvider } from '../components/contexts/WaitingRoomContext';
import { isValidReactComponent } from '../utils/common';
import { ChatMessagesProvider } from '../components/chat-messages/useChatMessages';
import VideoCallScreenWrapper from './video-call/VideoCallScreenWrapper';
import { useIsRecordingBot } from '../subComponents/recording/useIsRecordingBot';
import {
  userBannedText,
  videoRoomStartingCallText,
} from '../language/default-labels/videoCallScreenLabels';
import { useString } from '../utils/useString';
import { LogSource, logger } from '../logger/AppBuilderLogger';
import { useCustomization } from 'customization-implementation';
import { BeautyEffectProvider } from '../components/beauty-effect/useBeautyEffects';
import { UserActionMenuProvider } from '../components/useUserActionMenu';
import Toast from '../../react-native-toast-message';
import { AuthErrorCodes } from '../utils/common';
import useGetName from '../utils/useGetName';
import { useAuth } from './auth/AuthContext';
import { IRtcEngine } from 'react-native-agora';
import { useContent } from 'customization-api';
import { EmotionSnapshotProvider } from '../components/EmotionSnapshotContext';

enum RnEncryptionEnum {
  None = 0,
  AES128XTS = 1,
  AES128ECB = 2,
  AES256XTS = 3,
  SM4128ECB = 4,
  AES256GCM = 6,
  AES128GCM2 = 7,
  AES256GCM2 = 8,
}

const VideoCall: React.FC = () => {
  const hasBrandLogo = useHasBrandLogo();
  const joiningLoaderLabel = useString(videoRoomStartingCallText)();
  const bannedUserText = useString(userBannedText)();

  const { googleUser } = useAuth()
  const username = googleUser?.displayName
  const userUID = googleUser?.uid
  const { data } = useRoomInfo()

  const [rtcProps, setRtcProps] = React.useState({
    appId: $config.APP_ID,
    channel: null,
    uid: null,
    token: null,
    rtm: null,
    screenShareUid: null,
    screenShareToken: null,
    profile: $config.PROFILE,
    screenShareProfile: $config.SCREEN_SHARE_PROFILE,
    dual: true,
    encryption: $config.ENCRYPTION_ENABLED
      ? { key: null, mode: RnEncryptionEnum.AES128GCM2, screenKey: null }
      : false,
    role: ClientRoleType.ClientRoleBroadcaster,
    geoFencing: $config.GEO_FENCING,
    audioRoom: $config.AUDIO_ROOM,
    activeSpeaker: $config.ACTIVE_SPEAKER,
    preferredCameraId: null,
    preferredMicrophoneId: null,
    recordingBot: false,
  });

  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { awake, release } = useWakeLock();
  const { isRecordingBot } = useIsRecordingBot();

  const shouldCallBeSetToActive = isRecordingBot
    ? true
    : $config.PRECALL
      ? false
      : true;

  const [callActive, setCallActive] = useState(shouldCallBeSetToActive);
  const [isRecordingActive, setRecordingActive] = useState(false);
  const [queryComplete, setQueryComplete] = useState(false);
  const [waitingRoomAttendeeJoined, setWaitingRoomAttendeeJoined] =
    useState(false);
  const [sttAutoStarted, setSttAutoStarted] = useState(false);
  const [recordingAutoStarted, setRecordingAutoStarted] = useState(false);

  const { phrase } = useParams<{ phrase: string }>();

  const { store } = useContext(StorageContext);
  const {
    join: SdkJoinState,
    microphoneDevice: sdkMicrophoneDevice,
    cameraDevice: sdkCameraDevice,
    clearState,
  } = useContext(SdkApiContext);

  const afterEndCall = useCustomization(
    data =>
      data?.lifecycle?.useAfterEndCall && data?.lifecycle?.useAfterEndCall(),
  );

  const { PrefereceWrapper } = useCustomization(data => {
    let components: {
      PrefereceWrapper: React.ComponentType;
    } = {
      PrefereceWrapper: React.Fragment,
    };
    if (
      data?.components?.preferenceWrapper &&
      typeof data?.components?.preferenceWrapper !== 'object' &&
      isValidReactComponent(data?.components?.preferenceWrapper)
    ) {
      components.PrefereceWrapper = data?.components?.preferenceWrapper;
    }

    return components;
  });

  const history = useHistory();
  const currentMeetingPhrase = useRef(history.location.pathname);

  useEffect(() => {
    (window as any).__REACT_ROUTER_HISTORY__ = history;

    if (window.engine && window.engine.setNavigateCallback) {
      window.engine.setNavigateCallback((path: string) => {
        history.push(path);
      });
    }

    return () => {
      delete (window as any).__REACT_ROUTER_HISTORY__;
      if (window.engine && window.engine.setNavigateCallback) {
        window.engine.setNavigateCallback(null);
      }
    };
  }, [history]);

  const useJoin = useJoinRoom();
  const { setRoomInfo } = useSetRoomInfo();
  const { isJoinDataFetched, data: roomData, isInWaitingRoom, waitingRoomStatus } =
    useRoomInfo();

  useEffect(() => {
    if (!isJoinDataFetched) {
      return;
    }

    logger.log(LogSource.Internals, 'SET_MEETING_DETAILS', 'Room details', {
      user_id: roomData?.uid || '',
      meeting_title: roomData?.meetingTitle || '',
      channel_id: roomData?.channel,
      isHost: roomData?.isHost,
      username: username || '',
    });
  }, [isJoinDataFetched, roomData, phrase, username]);

  React.useEffect(() => {
    return () => {
      logger.debug(
        LogSource.Internals,
        'VIDEO_CALL_ROOM',
        'Videocall unmounted',
      );
      setRoomInfo(prevState => {
        return {
          ...RoomInfoDefaultValue,
          loginToken: prevState?.loginToken,
        };
      });
      if (awake) {
        release();
      }
    };
  }, []);

  useEffect(() => {
    if (!SdkJoinState.phrase) {
      useJoin(phrase, RoomInfoDefaultValue.roomPreference)
        .then(() => {
          logger.log(
            LogSource.Internals,
            'JOIN_MEETING',
            'Join channel success',
          );
        })
        .catch(error => {
          const errorCode = error?.code;
          if (AuthErrorCodes.indexOf(errorCode) !== -1 && isSDK()) {
            SDKEvents.emit('unauthorized', error);
          }
          logger.error(
            LogSource.Internals,
            'JOIN_MEETING',
            'Join channel error',
            JSON.stringify(error || {}),
          );
          setGlobalErrorMessage(error);
          history.push('/');
        });
    }
  }, []);

  useEffect(() => {
    if (!isSDK() || !SdkJoinState.initialized) {
      return;
    }
    const {
      phrase: sdkMeetingPhrase,
      meetingDetails: sdkMeetingDetails,
      skipPrecall,
      promise,
      preference,
    } = SdkJoinState;

    const sdkMeetingPath = `/${sdkMeetingPhrase}`;

    setCallActive(skipPrecall);

    if (sdkMeetingDetails) {
      setQueryComplete(false);
      setRoomInfo(roomInfo => {
        return {
          ...roomInfo,
          isJoinDataFetched: true,
          data: {
            ...roomInfo.data,
            ...sdkMeetingDetails,
          },
          roomPreference: preference,
        };
      });
    } else if (sdkMeetingPhrase) {
      setQueryComplete(false);
      currentMeetingPhrase.current = sdkMeetingPath;
      useJoin(sdkMeetingPhrase, preference)
        .then(() => {
          logger.log(
            LogSource.Internals,
            'JOIN_MEETING',
            'Join channel success',
          );
        })
        .catch(error => {
          const errorCode = error?.code;
          if (AuthErrorCodes.indexOf(errorCode) !== -1 && isSDK()) {
            SDKEvents.emit('unauthorized', error);
          }
          logger.error(
            LogSource.Internals,
            'JOIN_MEETING',
            'Join channel error',
            JSON.stringify(error || {}),
          );
          setGlobalErrorMessage(error);
          history.push('/');
          currentMeetingPhrase.current = '';
          promise.rej(error);
        });
    }
  }, [SdkJoinState]);

  React.useEffect(() => {
    // Guard: ensure data is available
    if (!roomData) return;

    if (
      (!$config.ENABLE_WAITING_ROOM &&
        isJoinDataFetched === true &&
        !queryComplete) ||
      ($config.ENABLE_WAITING_ROOM &&
        isJoinDataFetched === true &&
        roomData.isHost &&
        !queryComplete) ||
      ($config.ENABLE_WAITING_ROOM &&
        isJoinDataFetched === true &&
        !roomData.isHost &&
        (!queryComplete || !isInWaitingRoom) &&
        !waitingRoomAttendeeJoined)
    ) {
      setRtcProps(prevRtcProps => ({
        ...prevRtcProps,
        channel: roomData.channel,
        uid: roomData.uid,
        token: roomData.token,
        rtm: roomData.rtmToken,
        meetingTitle: roomData.meetingTitle || '',
        isHost: roomData.isHost,
        username: username,
        userUID: userUID,
        encryption: $config.ENCRYPTION_ENABLED
          ? {
            key: roomData.encryptionSecret,
            mode: roomData.encryptionMode,
            screenKey: roomData.encryptionSecret,
            salt: roomData.encryptionSecretSalt,
          }
          : false,
        screenShareUid: roomData.screenShareUid,
        screenShareToken: roomData.screenShareToken,
        role: roomData.isHost
          ? ClientRoleType.ClientRoleBroadcaster
          : ClientRoleType.ClientRoleAudience,
        preventJoin:
          !$config.ENABLE_WAITING_ROOM ||
            ($config.ENABLE_WAITING_ROOM && roomData.isHost) ||
            ($config.ENABLE_WAITING_ROOM &&
              !roomData.isHost &&
              waitingRoomStatus === WaitingRoomStatus.APPROVED)
            ? false
            : true,
      }));

      if (
        $config.ENABLE_WAITING_ROOM &&
        !roomData.isHost &&
        waitingRoomStatus === WaitingRoomStatus.APPROVED
      ) {
        setWaitingRoomAttendeeJoined(true);
      }
      setQueryComplete(true);
    }
  }, [isJoinDataFetched, roomData, queryComplete, username, userUID, isInWaitingRoom, waitingRoomStatus, waitingRoomAttendeeJoined]);

  const callbacks: CallbacksInterface = {
    EndCall: () => {
      clearState('join');
      sessionStorage.setItem('allowEndCall', 'true');
      setTimeout(() => {
        SDKEvents.emit('leave');
        if (afterEndCall) {
          afterEndCall(roomData?.isHost, history as unknown as History);
        } else {
          history.push('/endcall');
        }
      }, 0);
    },
    UserJoined: (uid: UidType) => {
      console.log('UIKIT Callback: UserJoined', uid);
      SDKEvents.emit('rtc-user-joined', uid);
    },
    UserOffline: (uid: UidType) => {
      console.log('UIKIT Callback: UserOffline', uid);
      SDKEvents.emit('rtc-user-left', uid);
    },
    RemoteAudioStateChanged: (uid: UidType, status: 0 | 2) => {
      console.log('UIKIT Callback: RemoteAudioStateChanged', uid, status);
      if (status === 0) {
        SDKEvents.emit('rtc-user-unpublished', uid, 'audio');
      } else {
        SDKEvents.emit('rtc-user-published', uid, 'audio');
      }
    },
    RemoteVideoStateChanged: (uid: UidType, status: 0 | 2) => {
      console.log('UIKIT Callback: RemoteVideoStateChanged', uid, status);
      if (status === 0) {
        SDKEvents.emit('rtc-user-unpublished', uid, 'video');
      } else {
        SDKEvents.emit('rtc-user-published', uid, 'video');
      }
    },
    UserBanned(isBanned) {
      console.log('UIKIT Callback: UserBanned', isBanned);
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: bannedUserText,
        visibilityTime: 3000,
      });
    },
  };

  return (
    <>
      {queryComplete ? (
        queryComplete || !callActive ? (
          <>
            <PropsProvider
              value={{
                rtcProps: {
                  ...rtcProps,
                  callActive,
                },
                callbacks,
                styleProps,
                mode: $config.EVENT_MODE
                  ? ChannelProfileType.ChannelProfileLiveBroadcasting
                  : ChannelProfileType.ChannelProfileCommunication,
              }}>
              <RtcConfigure>
                <DeviceConfigure>
                  <NoiseSupressionProvider callActive={callActive}>
                    <VideoQualityContextProvider>
                      <ChatUIControlsProvider>
                        <ChatNotificationProvider>
                          <LayoutProvider>
                            <FocusProvider>
                              <SidePanelProvider>
                                <ChatMessagesProvider callActive={callActive}>
                                  <ScreenShareProvider>
                                    <RtmConfigure callActive={callActive}>
                                      <UserPreferenceProvider
                                        callActive={callActive}>
                                        <CaptionProvider>
                                          <WaitingRoomProvider>
                                            <EventsConfigure
                                              setSttAutoStarted={
                                                setSttAutoStarted
                                              }
                                              sttAutoStarted={sttAutoStarted}
                                              callActive={callActive}>
                                              <ScreenshareConfigure
                                                isRecordingActive={
                                                  isRecordingActive
                                                }>
                                                <LiveStreamContextProvider
                                                  value={{
                                                    setRtcProps,
                                                    rtcProps,
                                                    callActive,
                                                  }}>
                                                  <LiveStreamDataProvider>
                                                    <LocalUserContext
                                                      localUid={rtcProps?.uid}>
                                                      <RecordingProvider
                                                        value={{
                                                          setRecordingActive,
                                                          isRecordingActive,
                                                          callActive,
                                                          recordingAutoStarted,
                                                          setRecordingAutoStarted,
                                                        }}>
                                                        <NetworkQualityProvider>
                                                          {!isMobileUA() && (
                                                            <PermissionHelper />
                                                          )}
                                                          <UserActionMenuProvider>
                                                            <VBProvider>
                                                              <BeautyEffectProvider>
                                                                <PrefereceWrapper
                                                                  callActive={
                                                                    callActive
                                                                  }
                                                                  setCallActive={
                                                                    setCallActive
                                                                  }>
                                                                  <SdkMuteToggleListener>
                                                                    {callActive ? (
                                                                      <EmotionSnapshotProvider>
                                                                        <VideoMeetingDataProvider>
                                                                          <VideoCallProvider>
                                                                            <DisableChatProvider>
                                                                              <VideoCallScreenWrapper />
                                                                            </DisableChatProvider>
                                                                          </VideoCallProvider>
                                                                        </VideoMeetingDataProvider>
                                                                      </EmotionSnapshotProvider>
                                                                    ) : $config.PRECALL ? (
                                                                      <PreCallProvider
                                                                        value={{
                                                                          callActive,
                                                                          setCallActive,
                                                                        }}>
                                                                        <Precall />
                                                                      </PreCallProvider>
                                                                    ) : (
                                                                      <></>
                                                                    )}
                                                                  </SdkMuteToggleListener>
                                                                </PrefereceWrapper>
                                                              </BeautyEffectProvider>
                                                            </VBProvider>
                                                          </UserActionMenuProvider>
                                                        </NetworkQualityProvider>
                                                      </RecordingProvider>
                                                    </LocalUserContext>
                                                  </LiveStreamDataProvider>
                                                </LiveStreamContextProvider>
                                              </ScreenshareConfigure>
                                            </EventsConfigure>
                                          </WaitingRoomProvider>
                                        </CaptionProvider>
                                      </UserPreferenceProvider>
                                    </RtmConfigure>
                                  </ScreenShareProvider>
                                </ChatMessagesProvider>
                              </SidePanelProvider>
                            </FocusProvider>
                          </LayoutProvider>
                        </ChatNotificationProvider>
                      </ChatUIControlsProvider>
                    </VideoQualityContextProvider>
                  </NoiseSupressionProvider>
                </DeviceConfigure>
              </RtcConfigure>
            </PropsProvider>
          </>
        ) : (
          <View style={style.loader}>
            <View style={style.loaderLogo}>{hasBrandLogo() && <Logo />}</View>
            <Text style={style.loaderText}>{joiningLoaderLabel}</Text>
          </View>
        )
      ) : (
        <></>
      )}
    </>
  );
};

const styleProps = {
  maxViewStyles: styles.temp,
  minViewStyles: styles.temp,
  localBtnContainer: styles.bottomBar,
  localBtnStyles: {
    muteLocalAudio: styles.localButton,
    muteLocalVideo: styles.localButton,
    switchCamera: styles.localButton,
    endCall: styles.endCall,
    fullScreen: styles.localButton,
    recording: styles.localButton,
    screenshare: styles.localButton,
  },
  theme: $config.PRIMARY_ACTION_BRAND_COLOR,
  remoteBtnStyles: {
    muteRemoteAudio: styles.remoteButton,
    muteRemoteVideo: styles.remoteButton,
    remoteSwap: styles.remoteButton,
    minCloseBtnStyles: styles.minCloseBtn,
    liveStreamHostControlBtns: styles.liveStreamHostControlBtns,
  },
  BtnStyles: styles.remoteButton,
};

const style = StyleSheet.create({
  full: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  videoView: theme.videoView,
  loader: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderLogo: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  loaderText: { fontWeight: '500', color: $config.FONT_COLOR },
});

export default VideoCall;