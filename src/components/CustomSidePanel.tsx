import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {isMobileUA, isWebInternal, useIsSmall} from '../utils/common';
import CommonStyles from './CommonStyles';
import SidePanelHeader, {
  SidePanelStyles,
} from '../subComponents/SidePanelHeader';
import {useLayout} from '../utils/useLayout';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import useCaptionWidth from '../subComponents/caption/useCaptionWidth';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import {CustomSidePanelHeader} from '../pages/video-call/SidePanelHeader';

export interface CustomSidePanelViewInterface {
  name: string;
  title?: string;
  content: React.ComponentType;
  onClose?: () => void;
  showHeader?: boolean;
}

const CustomSidePanelView = (props: CustomSidePanelViewInterface) => {
  const {
    content: CustomSidePanelContent,
    showHeader = true,
    name,
    title,
    onClose,
  } = props;
  const {currentLayout} = useLayout();
  const {transcriptHeight} = useCaptionWidth();
  const {setSidePanel} = useSidePanel();
  const isSmall = useIsSmall();

  return (
    <View
      testID="custom-side-panel"
      style={[
        isMobileUA()
          ? //mobile and mobile web
            CommonStyles.sidePanelContainerNative
          : isSmall()
          ? // desktop minimized
            CommonStyles.sidePanelContainerWebMinimzed
          : // desktop maximized
            CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? {marginVertical: 4}
          : {},
        //@ts-ignore
        transcriptHeight && !isMobileUA() && {height: transcriptHeight},
      ]}>
      {showHeader && (
        <CustomSidePanelHeader name={name} title={title} onClose={onClose} />
      )}
      <ScrollView contentContainerStyle={[style.bodyContainer]}>
        {CustomSidePanelContent ? <CustomSidePanelContent /> : <></>}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  bodyContainer: {
    flex: 1,
  },
});

export default CustomSidePanelView;
