import {createNanoEvents} from 'nanoevents';
import {UidType} from 'agora-rn-uikit';
import {IRemoteTrack} from 'agora-rtc-sdk-ng';

export interface userEventsMapInterface {
  leave: () => void;
  create: (
    hostPhrase: string,
    attendeePhrase?: string,
    pstnNumer?: {
      number: string;
      pin: string;
    },
  ) => void;
  'ready-to-join': (meetingTitle: string, devices: MediaDeviceInfo[]) => void;
  join: (
    meetingTitle: string,
    devices: MediaDeviceInfo[],
    isHost: boolean,
  ) => void;
  'rtc-user-published': (uid: UidType, trackType: 'audio' | 'video') => void;
  'rtc-user-unpublished': (uid: UidType, trackType: 'audio' | 'video') => void;
  'rtc-user-joined': (uid: UidType) => void;
  'rtc-user-left': (uid: UidType) => void;
  '_rtm-joined': (uid: UidType) => void;
  '_rtm-left': (uid: UidType) => void;
  'devices-selected-microphone-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'devices-selected-camera-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'devices-selected-speaker-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'token-not-found': () => void;
  'will-token-expire': () => void;
  'did-token-expire': () => void;
  'token-refreshed': () => void;
  'rtc-user-removed': (uid: UidType, channel: string) => void;
  unauthorized: (errorMessage) => void;
}

const SDKEvents = createNanoEvents<userEventsMapInterface>();

export default SDKEvents;
