/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Used for wallet encrypt and decrypt
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);
