/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthorPlaylistScreen } from './src/screens/AuthorPlaylistScreen';
import { RootStackParamList } from './types';
import MainScreen from './src/screens/MainScreen';
import { useEffect } from 'react';
import { setupPlayerOnce } from './src/player/setup';
import AlbumScreen from './src/screens/AlbumScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  useEffect(() => {
    setupPlayerOnce();
  }, []);
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
          <Stack.Screen name="AuthorPlaylist" component={AuthorPlaylistScreen} />
          <Stack.Screen name="Album" component={AlbumScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
