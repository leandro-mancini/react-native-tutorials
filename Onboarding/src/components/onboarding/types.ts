import type { StyleProp, ViewStyle } from 'react-native';

export type Slide = {
  key: string;
  title: string;
  subtitle: string;
  bg: string;
  lottie: any;
  lottieStyle?: StyleProp<ViewStyle>;
  lottieBoxStyle?: StyleProp<ViewStyle>;
};
