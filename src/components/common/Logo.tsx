import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {useHasBrandLogo} from '../../utils/common';
const Logo: React.FC = () => {
  const hasBrandLogo = useHasBrandLogo();
  const hasLogo = hasBrandLogo();
  if (!hasLogo) {
    return null;
  }

  return (
    <Image
      source={{uri: $config.LOGO}}
      style={style.logo}
      resizeMode="contain"
    />
  );
};
export default Logo;
const style = StyleSheet.create({
  logo: {
    width: 78,
    height: 26,
  },
});
