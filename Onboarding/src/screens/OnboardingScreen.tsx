import React from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Footer } from '../components/onboarding/Footer';
import { SLIDES } from '../constants/onboardingSlides';
import type { Slide, CommonSlideProps } from '../components/onboarding/types';
import { SlideItem } from '../components/onboarding/SlideItem';

import Figure1Step1 from '../../assets/svg/figure1-step1.svg';
import Figure2Step1 from '../../assets/svg/figure2-step1.svg';
import Figure3Step1 from '../../assets/svg/figure3-step1.svg';
import Figure4Step3 from '../../assets/svg/figure4-step3.svg';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
  const pagerRef = useAnimatedRef<Animated.FlatList<any>>();
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { x.value = e.contentOffset.x; },
  });

  const bgStyle = useAnimatedStyle(() => {
    const i = x.value / width;
    const colors = SLIDES.map((s) => s.bg);
    return {
      backgroundColor: interpolateColor(i, SLIDES.map((_, idx) => idx), colors),
    };
  });

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const props: CommonSlideProps = { item, index, x, width };
    const Comp = item.render ?? SlideItem;  // fallback
    return <Comp {...props} />;
  };

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        <Figure1Step1 width={111} height={175} color="#F4C9FF" style={{ position: 'absolute', top: 90, left: -50 }} />
        <Figure2Step1 width={213.29} height={93.1} color="#DF61FF" style={{ position: 'absolute', top: -40, left: 0 }} />
        <Figure3Step1 width={70.49} height={150.37} color="#C180F4" style={{ position: 'absolute', top: 20, right: 0, transform: [{ scale: 1.4 }] }} />
        <Figure4Step3 width={310} height={286} color="#FF7171" style={{ position: 'absolute', top: 200, right: -165, transform: [{"scale":0.6}] }} />
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
          onFinish={() => {/* navega pra Home */}}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });