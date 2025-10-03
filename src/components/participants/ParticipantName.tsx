import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Text,
} from 'react-native';
import TextWithToolTip from '../../subComponents/TextWithTooltip';
import {RFValue} from 'react-native-responsive-fontsize';
import {isWebInternal} from '../../utils/common';

const ParticipantName = ({value}: {value: string}) => {
  const {height, width} = useWindowDimensions();
  const fontSize = isWebInternal() ? 14 : 16;
  return (
    <View style={{flex: 1}}>
      <TextWithToolTip
        value={value}
        style={[
          style.participantText,
          {
            fontSize: RFValue(fontSize, height > width ? height : width),
          },
        ]}
      />
    </View>
  );
};
export default ParticipantName;

const style = StyleSheet.create({
  participantText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Source Sans Pro',
    flexDirection: 'row',
    color: $config.FONT_COLOR,
    textAlign: 'left',
    textTransform: 'capitalize',
  },
});
