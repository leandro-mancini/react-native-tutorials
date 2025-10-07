import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import { Slide } from './types';

const AnimatedText = Animated.createAnimatedComponent(Text);

export type SlideItemProps = {
  item: Slide;
  index: number;
  x: SharedValue<number>;
  width: number;
};

export const SlideItem = React.memo(({ item, index, x, width }: SlideItemProps) => {
  const rel = useDerivedValue(() => (index * width - x.value) / width, [index]);

  const TITLE_DIST = 70;
  const SUB_DIST = 70;
  const STEP_DELAY = 0.5;

  const titleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;
    const dir = r > 0 ? 1 : r < 0 ? -1 : 0;

    let exposure = 1 - Math.abs(r);
    exposure = Math.max(0, Math.min(1, exposure));

    const e = exposure * exposure;

    let eTitle = e;
    if (dir < 0) {
      eTitle = (e - STEP_DELAY) / (1 - STEP_DELAY);
      eTitle = Math.max(0, Math.min(1, eTitle));
    }

    const tx = dir * (1 - eTitle) * TITLE_DIST;
    return { transform: [{ translateX: tx }] };
  });

  const subtitleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;
    const dir = r > 0 ? 1 : r < 0 ? -1 : 0;

    let exposure = 1 - Math.abs(r);
    exposure = Math.max(0, Math.min(1, exposure));

    const e = exposure * exposure;

    let eSub = e;
    if (dir > 0) {
      eSub = (e - STEP_DELAY) / (1 - STEP_DELAY);
      eSub = Math.max(0, Math.min(1, eSub));
    }

    const tx = dir * (1 - eSub) * SUB_DIST;
    return { transform: [{ translateX: tx }] };
  });

  return (
    <View style={[styles.slide, { width }]}>      
      <View style={[styles.illustrationBox, item.lottieBoxStyle]}>        
        <LottieView
          source={item.lottie}
          autoPlay
          loop
          style={[{ width: 800, height: 800, alignSelf: 'center' }, item.lottieStyle]}
        />
      </View>
      <View style={styles.header}>
        <AnimatedText style={[styles.title, titleStyleAnim]}>{item.title}</AnimatedText>
        <AnimatedText style={[styles.subtitle, subtitleStyleAnim]}>
          {item.subtitle}
        </AnimatedText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    paddingTop: 0,
    paddingHorizontal: 24,
    gap: 0,
  },
  title: {
    fontSize: 40,
    color: '#000',
    fontFamily: 'Poppins-ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#3C3C3C',
    fontFamily: 'Poppins-Medium',
  },
  illustrationBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
