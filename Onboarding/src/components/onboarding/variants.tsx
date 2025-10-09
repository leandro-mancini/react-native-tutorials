import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import type { CommonSlideProps } from './types';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

import Step1Svg from '../../../assets/svg/onboarding_step1.svg';
import Step2Svg from '../../../assets/svg/onboarding_step2.svg';
import Step3Svg from '../../../assets/svg/onboarding_step3.svg';

// 1) Reaproveita SlideItem padrão (atalho)
export const SlideHero = (p: CommonSlideProps) => {
  const { item } = p;
  return (
    <BaseSlide {...p}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
        <Step1Svg width={428} height={448} />
      </View>
    </BaseSlide>
  );
};

// 2) Lottie maior, encostado à esquerda
export const SlideLeftImage = (p: CommonSlideProps) => {
  const { item } = p;
  return (
    <BaseSlide {...p}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', transform: [{"translateX":-15},{"translateY":30}] }}>
        <Step2Svg width={428} height={448} />
      </View>
    </BaseSlide>
  );
};

// 3) Lottie mais baixo e maior
export const SlideBottomBig = (p: CommonSlideProps) => {
  const { item } = p;
  return (
    <BaseSlide {...p}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', transform: [{"translateY":15}] }}>
        <Step3Svg width={428} height={448} />
      </View>
    </BaseSlide>
  );
};

/** Base estruturante para variantes simples */
const BaseSlide = ({
  item, index, x, width,
  titleAlign = 'left',
  children,
}: CommonSlideProps & {
  titleAlign?: 'left' | 'center';
  children?: React.ReactNode;
}) => {
  const rel = useDerivedValue(() => (index * width - x.value) / width, [index]);

  const TITLE_DIST = 70;
  const SUB_DIST   = 70;
  const STEP_DELAY = 0.5;

  const titleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;
    const dir = r > 0 ? 1 : r < 0 ? -1 : 0;

    let exposure = 1 - Math.abs(r);
    if (exposure < 0) exposure = 0;
    if (exposure > 1) exposure = 1;

    const e = exposure * exposure;

    let eTitle = e;
    // vindo da direita -> entra primeiro o title (msm regra do SlideItem)
    if (dir < 0) {
      eTitle = (e - STEP_DELAY) / (1 - STEP_DELAY);
      if (eTitle < 0) eTitle = 0;
      if (eTitle > 1) eTitle = 1;
    }

    const tx = dir * (1 - eTitle) * TITLE_DIST;
    return { transform: [{ translateX: tx }] };
  });

  const subtitleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;
    const dir = r > 0 ? 1 : r < 0 ? -1 : 0;

    let exposure = 1 - Math.abs(r);
    if (exposure < 0) exposure = 0;
    if (exposure > 1) exposure = 1;

    const e = exposure * exposure;

    let eSub = e;
    // vindo da esquerda -> entra primeiro o subtitle (msm regra do SlideItem)
    if (dir > 0) {
      eSub = (e - STEP_DELAY) / (1 - STEP_DELAY);
      if (eSub < 0) eSub = 0;
      if (eSub > 1) eSub = 1;
    }

    const tx = dir * (1 - eSub) * SUB_DIST;
    return { transform: [{ translateX: tx }] };
  });

  return (
    <View style={{ flex: 1, width }}>
      <View style={[styles.illustrationBox]}>
        {children}
      </View>

      <View style={[styles.header, titleAlign === 'center' && { alignItems: 'center' }]}>
        <AnimatedText style={[styles.title, titleStyleAnim]}>{item.title}</AnimatedText>
        <AnimatedText style={[styles.subtitle, subtitleStyleAnim]}>{item.subtitle}</AnimatedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24 },
  title: { fontSize: 40, color: '#000', fontFamily: 'Poppins-ExtraBold' },
  subtitle: { fontSize: 16, color: '#3C3C3C', fontFamily: 'Poppins-Medium' },
  illustrationBox: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' },
});