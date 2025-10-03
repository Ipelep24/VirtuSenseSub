import {useContent, useRtc} from 'customization-api';
import React from 'react';
import {MaxVideoView} from '../../../agora-rn-uikit';
import VideoFallback from './VideoFallback';

const VideoPreview = () => {
  const rtc = useRtc();
  rtc?.RtcEngineUnsafe?.startPreview();

  const {defaultContent, activeUids} = useContent();
  const [maxUid] = activeUids;

  if (!maxUid) {
    return null;
  }

  return (
    <MaxVideoView
      user={defaultContent[maxUid]}
      key={maxUid}
      fallback={VideoFallback}
      containerStyle={{
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
      }}
      isFullView={true}
    />
  );
};

export default VideoPreview;
