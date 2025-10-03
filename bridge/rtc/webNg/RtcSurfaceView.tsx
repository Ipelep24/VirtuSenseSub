import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect} from 'react';
import {StyleProp, StyleSheet, ViewProps, ViewStyle} from 'react-native';
import {RenderModeType} from './Types';
import {LogSource, logger} from '../../../src/logger/AppBuilderLogger';

export interface RtcSurfaceViewProps extends ViewProps {
  canvas: {
    renderMode?: RenderModeType;
    uid?: number;
  };
}

export interface StyleProps {
  style?: StyleProp<ViewStyle>;
}

interface SurfaceViewInterface extends RtcSurfaceViewProps, StyleProps {}

const RtcSurfaceView = (props: SurfaceViewInterface) => {
  const {uid, renderMode} = props.canvas;
  const stream: ILocalVideoTrack | IRemoteVideoTrack =
    uid === 0
      ? window.engine.localStream.video
      : uid === 1
      ? window.engine.screenStream.video
      : window.engine.remoteStreams.get(uid)?.video;
  useEffect(
    function () {
      if (stream?.play) {
        if (renderMode === RenderModeType.RenderModeFit) {
          stream.play(String(uid), {fit: 'contain'});
        } else {
          stream.play(String(uid));
        }
      }
      return () => {
        console.log(`unmounting stream ${uid}`, stream);
        stream && stream.stop();
      };
    },
    [uid, renderMode, stream],
  );

  return stream ? (
    <div
      id={String(uid)}
      className={'video-container'}
      style={{...style.full, ...(props.style as Object), overflow: 'hidden'}}
    />
  ) : (
    <div style={{...style.full, backgroundColor: 'black'}} />
  );
};

const style = StyleSheet.create({
  full: {
    flex: 1,
  },
});

export default RtcSurfaceView;
