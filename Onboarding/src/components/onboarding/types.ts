import type { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type Slide = {
  key: string;
  title: string;
  subtitle: string;
  bg: string;
  lottie: any;
  lottieStyle?: StyleProp<ViewStyle>;
  lottieBoxStyle?: StyleProp<ViewStyle>;
  render?: React.ComponentType<CommonSlideProps>;
};

export type CommonSlideProps = {
  item: Slide;
  index: number;
  x: SharedValue<number>;
  width: number;
};

export type SlideWithRenderer = Slide & { render?: (p: CommonSlideProps) => React.ReactNode };