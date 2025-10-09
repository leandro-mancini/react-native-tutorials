// OnboardingScreen.tsx
import React, { useMemo } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Footer } from '../components/onboarding/Footer';
import { SLIDES } from '../constants/onboardingSlides';
import { SlideItem } from '../components/onboarding/SlideItem';
import type { Slide, CommonSlideProps } from '../components/onboarding/types';

import Figure1Step1 from '../../assets/svg/figure1-step1.svg';
import Figure2Step1 from '../../assets/svg/figure2-step1.svg';
import Figure3Step1 from '../../assets/svg/figure3-step1.svg';
import Figure4Step3 from '../../assets/svg/figure4-step3.svg';

const AF1 = Animated.createAnimatedComponent(Figure1Step1 as any);
const AF2 = Animated.createAnimatedComponent(Figure2Step1 as any);
const AF3 = Animated.createAnimatedComponent(Figure3Step1 as any);
const AF4 = Animated.createAnimatedComponent(Figure4Step3 as any);

const { width } = Dimensions.get('window');
const STEPS = SLIDES.length;

type Pose = {
  top?: number;
  left?: number;  // use left OU right
  right?: number;
  scale?: number;
  rotate?: number; // em graus
};
type FigSpec = {
  key: string;
  Component: any;
  size: { width: number; height: number };
  color: string;
  // poses por step (0..STEPS-1)
  poses: Pose[];
};

// 🔧 CONFIGURÁVEL POR STEP
const FIGS: FigSpec[] = [
  {
    key: 'f1',
    Component: AF1,
    size: { width: 111, height: 175 },
    color: '#F4C9FF',
    poses: [
      // step 0 (valores atuais)
      { top: 90, left: -50, scale: 1 },
      // step 1
      { top: 110, left: -80, scale: 1, rotate: 50, },
      // step 2
      { top: 300, left: -50, scale: 1, rotate: 160, },
    ],
  },
  {
    key: 'f2',
    Component: AF2,
    size: { width: 213.29, height: 93.1 },
    color: '#DF61FF',
    poses: [
      { top: -30, left: -20, scale: 1 },
      { top: 0, left: 0, scale: 1.2, rotate: -60 },
      { top: -35, left: -90, scale: 1.6, rotate: 10},
    ],
  },
  {
    key: 'f3',
    Component: AF3,
    size: { width: 70.49, height: 150.37 },
    color: '#C180F4',
    poses: [
      { top: 20, right: 0, scale: 1.4 },
      { top: 30, right: 0, scale: 1.8, rotate: -160 },
      { top: 30, right: 20, scale: 2.2, rotate: -290 },
    ],
  },
  {
    key: 'f4',
    Component: AF4,
    size: { width: 310, height: 286 },
    color: '#FF7171',
    poses: [
      // aparece desde o step 0 já fora da tela, entra no step 2
      { top: 200, right: -300, scale: 0.6 },
      { top: 180, right: -195, scale: 0.6, rotate: 40 },
      { top: 220, right: -170, scale: 0.6, rotate: 5},
    ],
  },
];

// util: carrega valor do step, herdando do anterior se faltar
function toSeries(poses: Pose[], prop: keyof Pose, steps: number): number[] | null {
  const out: (number | undefined)[] = new Array(steps).fill(undefined);
  let last: number | undefined = undefined;
  for (let i = 0; i < steps; i++) {
    const v = poses[i]?.[prop];
    if (typeof v === 'number') last = v;
    out[i] = last;
  }
  // se nenhum step definiu esse prop, não interpola
  const any = out.some((v) => typeof v === 'number');
  if (!any) return null;
  return out.map((v) => (typeof v === 'number' ? v : 0));
}

export default function OnboardingScreen({ navigation }: any) {
  const pagerRef = useAnimatedRef<Animated.FlatList<any>>();
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { x.value = e.contentOffset.x; },
  });

  const indices = useMemo(() => SLIDES.map((_, i) => i), []);
  const bgStyle = useAnimatedStyle(() => {
    const i = x.value / width;
    const colors = SLIDES.map((s) => s.bg);
    return {
      backgroundColor: interpolateColor(i, indices, colors),
    };
  });

  // cria style animado por figura a partir das séries por step
  const makePoseStyle = (fig: FigSpec) => {
    const sTop = toSeries(fig.poses, 'top', STEPS);
    const sLeft = toSeries(fig.poses, 'left', STEPS);
    const sRight = toSeries(fig.poses, 'right', STEPS);
    const sScale = toSeries(fig.poses, 'scale', STEPS) ?? new Array(STEPS).fill(1);
    const sRot = toSeries(fig.poses, 'rotate', STEPS) ?? new Array(STEPS).fill(0);

    return useAnimatedStyle(() => {
      const i = x.value / width;
      const style: any = { position: 'absolute' };

      if (sTop)   style.top   = interpolate(i, indices, sTop,   Extrapolation.CLAMP);
      if (sLeft)  style.left  = interpolate(i, indices, sLeft,  Extrapolation.CLAMP);
      if (sRight) style.right = interpolate(i, indices, sRight, Extrapolation.CLAMP);

      const scale  = interpolate(i, indices, sScale, Extrapolation.CLAMP);
      const rotate = interpolate(i, indices, sRot,   Extrapolation.CLAMP);

      style.transform = [{ scale }, { rotate: `${rotate}deg` }];
      return style;
    });
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const props: CommonSlideProps = { item, index, x, width };
    const Comp = item.render ?? SlideItem;
    return <Comp {...props} />;
  };

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        {FIGS.map((f) => {
          const Comp = f.Component;
          const styleAnim = makePoseStyle(f);
          return (
            <Comp
              key={f.key}
              width={f.size.width}
              height={f.size.height}
              color={f.color}
              pointerEvents="none"
              style={styleAnim}
            />
          );
        })}

        <Animated.FlatList
          ref={pagerRef}
          data={SLIDES}
          keyExtractor={(s) => s.key}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />

        <Footer
          x={x}
          pagerRef={pagerRef}
          total={SLIDES.length}
          width={width}
          onFinish={() => { /* navegar para Home */ }}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
