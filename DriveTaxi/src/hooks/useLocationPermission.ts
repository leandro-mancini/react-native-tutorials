import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export type LocationPermissionState = 'unknown' | 'granted' | 'denied';

export function useLocationPermission() {
  const [state, setState] = useState<LocationPermissionState>('unknown');

  useEffect(() => {
    const ask = async () => {
      if (Platform.OS !== 'android') {
        // iOS: o prompt será disparado automaticamente pela MapView/LocationManager
        setState('granted');
        return;
      }
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        setState(granted === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied');
      } catch (e) {
        setState('denied');
      }
    };
    ask();
  }, []);

  return state;
}
