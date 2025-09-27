import {AppRegistry} from 'react-native';
import Video from './src/App';
import './src/assets/font-styles.css';

AppRegistry.registerComponent('App', () => Video);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('react-app'),
});
