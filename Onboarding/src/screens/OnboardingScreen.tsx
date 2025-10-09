// OnboardingScreen.tsx
import React, { useMemo } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
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

import Ball1 from '../../assets/svg/ball1.svg';
import Ball2 from '../../assets/svg/ball2.svg';
import Ball3 from '../../assets/svg/ball3.svg';

const AF1 = Animated.createAnimatedComponent(Figure1Step1 as any);
const AF2 = Animated.createAnimatedComponent(Figure2Step1 as any);
const AF3 = Animated.createAnimatedComponent(Figure3Step1 as any);
const AF4 = Animated.createAnimatedComponent(Figure4Step3 as any);

const AB1 = Animated.createAnimatedComponent(Ball1 as any);
const AB2 = Animated.createAnimatedComponent(Ball2 as any);
const AB3 = Animated.createAnimatedComponent(Ball3 as any);

const { width } = Dimensions.get('window');
const STEPS = SLIDES.length;

type Pose = {
  top?: number;
  left?: number;  // use left OU right
  right?: number;
  scale?: number;
  rotate?: number; // em graus
  fill?: string;
};
type FigSpec = {
  key: string;
  Component: any;
  size: { width: number; height: number };
  fill: string;
  // poses por step (0..STEPS-1)
  poses: Pose[];
};

// 🔧 CONFIGURÁVEL POR STEP
const FIGS: FigSpec[] = [
  {
    key: 'f1',
    Component: AF1,
    size: { width: 111, height: 175 },
    fill: '#F4C9FF',
    poses: [
      // step 0 (valores atuais)
      { top: 90, left: -50, scale: 1, fill: '#F4C9FF' },
      // step 1
      { top: 110, left: -80, scale: 1, rotate: 50, fill: '#5977A5' },
      // step 2
      { top: 300, left: -50, scale: 1, rotate: 160, fill: '#F24BAF' },
    ],
  },
  {
    key: 'f2',
    Component: AF2,
    size: { width: 213.29, height: 93.1 },
    fill: '#DF61FF',
    poses: [
      { top: -30, left: -20, scale: 1, fill: '#DF61FF' },
      { top: 0, left: 0, scale: 1.2, rotate: -60, fill: '#B34DCD' },
      { top: -35, left: -90, scale: 1.6, rotate: 10, fill: '#B34DCD' },
    ],
  },
  {
    key: 'f3',
    Component: AF3,
    size: { width: 70.49, height: 150.37 },
    fill: '#C180F4',
    poses: [
      { top: 20, right: 0, scale: 1.4, fill: '#C180F4' },
      { top: 30, right: 0, scale: 1.8, rotate: -160, fill: '#B04BFF' },
      { top: 30, right: 20, scale: 2.2, rotate: -290, fill: '#B04BFF' },
    ],
  },
  {
    key: 'f4',
    Component: AF4,
    size: { width: 310, height: 286 },
    fill: '#FF7171',
    poses: [
      // aparece desde o step 0 já fora da tela, entra no step 2
      { top: 200, right: -300, scale: 0.6 },
      { top: 180, right: -195, scale: 0.6, rotate: 40 },
      { top: 220, right: -170, scale: 0.6, rotate: 5},
    ],
  },

  {
    key: 'b1',
    Component: AB1,
    size: { width: 32, height: 32 },
    fill: '#6BB8FF',
    poses: [
      // step 0 (valores atuais)
      { top: 115, left: 77, scale: 0.8 },
      // step 1
      { top: 120, left: 220, scale: 1, fill: '#ECE9A4' },
      // step 2
      { top: 315, left: 30, scale: 1, fill: '#FFC966' },
    ],
  },
  {
    key: 'b2',
    Component: AB2,
    size: { width: 18, height: 18 },
    fill: '#FF5CA1',
    poses: [
      // step 0 (valores atuais)
      { top: 220, left: 270, scale: 1 },
      // step 1
      { top: 405, left: 60, scale: 1, fill: '#FF5CA1' },
      // step 2
      { top: 355, left: 250, scale: 1.8, fill: '#FC825A' },
    ],
  },
  {
    key: 'b3',
    Component: AB3,
    size: { width: 29, height: 29 },
    fill: '#1E9E9A',
    poses: [
      // step 0 (valores atuais)
      { top: 405, left: 60, scale: 1 },
      // step 1
      { top: 185, left: 315, scale: 1 },
      // step 2
      { top: 135, left: 77, scale: 1.4 },
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

function toColorSeries(poses: Pose[], steps: number, fallback: string): string[] {
  const out: (string | undefined)[] = new Array(steps).fill(undefined);
  let last: string | undefined = fallback;
  for (let i = 0; i < steps; i++) {
    const v = poses[i]?.fill;
    if (typeof v === 'string') last = v;
    out[i] = last;
  }
  return out.map((v) => v ?? fallback);
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
    
    const sFill  = toColorSeries(fig.poses, STEPS, fig.fill);

    const styleAnim = useAnimatedStyle(() => {
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

    // 🎨 animação de FILL via props do SVG
    const animatedProps = useAnimatedProps(() => {
      const i = x.value / width;
      const color = interpolateColor(i, indices, sFill); // séries por step
      return { color } as any; // <<<<<< ANIME 'color' NO ROOT <Svg>
    });

    return { styleAnim, animatedProps };
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
          const { styleAnim, animatedProps } = makePoseStyle(f);
          return (
            <Comp
              key={f.key}
              width={f.size.width}
              height={f.size.height}
              color={f.fill}
              pointerEvents="none"
              style={styleAnim}
              animatedProps={animatedProps}
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
