import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useCustomization} from 'customization-implementation';
import {isValidReactComponent} from '../../utils/common';
import LocalAudioMute, {
  LocalAudioMuteProps,
} from '../../subComponents/LocalAudioMute';
import LocalVideoMute, {
  LocalVideoMuteProps,
} from '../../subComponents/LocalVideoMute';
import LocalSwitchCamera, {
  LocalSwitchCameraProps,
} from '../../subComponents/LocalSwitchCamera';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';

const PreCallLocalMute: React.FC = () => {
  const {VideoMute, AudioMute} = useCustomization((data) => {
    let components: {
      VideoMute: React.ComponentType<LocalAudioMuteProps>;
      AudioMute: React.ComponentType<LocalVideoMuteProps>;
    } = {
      AudioMute: LocalAudioMute,
      VideoMute: LocalVideoMute,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data.components?.precall?.audioMute &&
    //     typeof data.components?.precall?.audioMute !== 'object'
    //   ) {
    //     if (
    //       data.components?.precall?.audioMute &&
    //       isValidReactComponent(data.components?.precall?.audioMute)
    //     ) {
    //       components.AudioMute = data.components?.precall?.audioMute;
    //     }
    //   }

    //   if (
    //     data.components?.precall?.videoMute &&
    //     typeof data.components?.precall?.videoMute !== 'object'
    //   ) {
    //     if (
    //       data.components?.precall?.videoMute &&
    //       isValidReactComponent(data.components?.precall?.videoMute)
    //     ) {
    //       components.VideoMute = data.components?.precall?.videoMute;
    //     }
    //   }
    // }
    return components;
  });

  return (
    <View style={style.precallControls} testID="precall-controls">
      {!$config.AUDIO_ROOM && (
        <View style={{alignSelf: 'center', marginRight: 30}}>
          <VideoMute />
        </View>
      )}
      <View style={{alignSelf: 'center'}}>
        <AudioMute />
      </View>
      {/* <View style={style.width50}>
        <AudioMute />
      </View>
      {!$config.AUDIO_ROOM && (
        <>
          <View style={style.width50} />
          <View style={style.width50}>
            <VideoMute />
          </View>
          <View style={style.width50} />
          <View style={style.width50}>
            <LocalSwitchCamera />
          </View>
        </>
      )} */}
    </View>
  );
};
export const PreCallLocalMuteComponentsArray: [
  (props: LocalAudioMuteProps) => JSX.Element,
  (props: LocalVideoMuteProps) => JSX.Element,
  (props: LocalSwitchCameraProps) => JSX.Element,
] = [LocalAudioMute, LocalVideoMute, LocalSwitchCamera];
export default PreCallLocalMute;

const style = StyleSheet.create({
  width50: {width: 50},
  precallControls: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: $config.CARD_LAYER_1_COLOR,
  },
});
