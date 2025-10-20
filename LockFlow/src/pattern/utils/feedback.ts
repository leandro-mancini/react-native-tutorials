import { Platform, Vibration } from 'react-native';

export function safeVibrate(ms = 60) {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') Vibration.vibrate(ms);
  } catch {}
}
