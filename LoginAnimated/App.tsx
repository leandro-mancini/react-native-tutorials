/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <LoginScreen />
    </>
  );
}
