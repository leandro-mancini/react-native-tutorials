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
      <SafeAreaView style={{ flex: 1 }}>
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