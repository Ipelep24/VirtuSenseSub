import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {PropsContext, ClientRoleType} from '../../agora-rn-uikit';
import LocalAudioMute, {
  LocalAudioMuteProps,
} from '../subComponents/LocalAudioMute';
import LocalVideoMute, {
  LocalVideoMuteProps,
} from '../subComponents/LocalVideoMute';
import Recording, {RecordingButtonProps} from '../subComponents/Recording';
import LiveStreamControls, {
  LiveStreamControlsProps,
} from './livestream/views/LiveStreamControls';
import {useRoomInfo} from './room-info/useRoomInfo';
import ScreenshareButton, {
  ScreenshareButtonProps,
} from '../subComponents/screenshare/ScreenshareButton';
import LocalEndcall, {LocalEndcallProps} from '../subComponents/LocalEndCall';
import LocalSwitchCamera, {
  LocalSwitchCameraProps,
} from '../subComponents/LocalSwitchCamera';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

const Controls = () => {
  const {
    data: {isHost},
  } = useRoomInfo();
  const {rtcProps} = useContext(PropsContext);

  return (
    <View style={style.bottomBar}>
      {$config.EVENT_MODE &&
      rtcProps.role == ClientRoleType.ClientRoleAudience ? (
        <LiveStreamControls showControls={true} />
      ) : (
        <>
          {/**
           * In event mode when raise hand feature is active
           * and audience is promoted to host, the audience can also
           * demote himself
           */}
          {$config.EVENT_MODE && (
            <LiveStreamControls
              showControls={
                rtcProps?.role == ClientRoleType.ClientRoleBroadcaster &&
                !isHost
              }
            />
          )}
          <View style={{alignSelf: 'center'}}>
            <LocalAudioMute />
          </View>
          {!$config.AUDIO_ROOM && (
            <View style={{alignSelf: 'center'}}>
              <LocalVideoMute />
            </View>
          )}
          {isHost && $config.CLOUD_RECORDING && (
            <View style={{alignSelf: 'baseline'}}>
              <Recording />
            </View>
          )}
          {!$config.AUDIO_ROOM && (
            <View style={{alignSelf: 'center'}}>
              <LocalSwitchCamera />
            </View>
          )}
        </>
      )}
      <View style={{alignSelf: 'center'}}>
        <LocalEndcall />
      </View>
    </View>
  );
};
export const ControlsComponentsArray: [
  (props: LocalAudioMuteProps) => JSX.Element,
  (props: LocalVideoMuteProps) => JSX.Element,
  (props: LocalSwitchCameraProps) => JSX.Element,
  (props: ScreenshareButtonProps) => JSX.Element,
  (props: RecordingButtonProps) => JSX.Element,
  (props: LocalEndcallProps) => JSX.Element,
  (props: LiveStreamControlsProps) => JSX.Element,
] = [
  LocalAudioMute,
  LocalVideoMute,
  LocalSwitchCamera,
  ScreenshareButton,
  Recording,
  LocalEndcall,
  LiveStreamControls,
];
const style = StyleSheet.create({
  bottomBar: {
    flex: 1,
    paddingHorizontal: '1%',
    backgroundColor:
      $config.SECONDARY_ACTION_COLOR + hexadecimalTransparency['80%'],
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
    margin: 0,
    minHeight: 40,
    bottom: 0,
  },
  localButton: {
    backgroundColor: $config.SECONDARY_ACTION_COLOR,
    borderRadius: 2,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    width: 40,
    height: 40,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 35,
    height: 35,
    tintColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
});

export default Controls;
