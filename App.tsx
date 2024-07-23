import React from 'react';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Loading from './src/screens/Loading';
import FirstPage from './src/screens/FirstPage';
import ImportWallet from './src/screens/ImportWallet';
import Dashboard from './src/screens/Dashboard';
import Backup from './src/screens/Backup';

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

const StackNavigatorConfig = {
  headerShown: false,
  gestureEnabled: false,
};

function App(): React.JSX.Element {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={StackNavigatorConfig}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="ImportWallet" component={ImportWallet} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Backup" component={Backup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
