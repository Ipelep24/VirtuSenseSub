import React from 'react';

import {MaxVideoView} from '../../../agora-rn-uikit';

import {useContent} from 'customization-api';

import VideoFallback from './VideoFallback';
import {isMobileUA} from '../../utils/common';

const VideoPreview = () => {
  const {defaultContent, activeUids} = useContent();
  const [maxUid] = activeUids;
  const isMobileView = isMobileUA();

  const mobileContainerStyle = {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  };

  if (!maxUid) {
    return null;
  }

  return (
    <MaxVideoView
      user={defaultContent[maxUid]}
      key={maxUid}
      fallback={VideoFallback}
      containerStyle={{
        minHeight: 200,
        width: '100%',
        height: '100%',
        borderRadius: 8,
        ...(isMobileView ? mobileContainerStyle : {}),
      }}
      isFullView={true}
    />
  );
};

export default VideoPreview;
