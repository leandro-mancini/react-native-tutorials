import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

type Props = {
  progress: SharedValue<number>;
  size?: number;
  ringThickness?: number;
  iconSize?: number;
  angleStartDeg?: number;
  angleEndDeg?: number;
};

const AnimatedLottie = Animated.createAnimatedComponent(LottieView);

export const SunMoon = memo(({
  progress,
  size = 260,
  ringThickness = 14,
  iconSize = 200,
  angleStartDeg = -90,
  angleEndDeg = 90,
}: Props) => {
    const HALF = size / 2;
    const R = HALF - ringThickness / 2;

    const axisAngle = useDerivedValue(() =>
      interpolate(progress.value, [0, 1], [angleStartDeg, angleEndDeg])
    );

    // eixo girando
    const axisStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${axisAngle.value}deg` }],
    }));

    // contra-rotação para manter o Lottie "em pé"
    const uprightStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${-axisAngle.value}deg` }],
    }));

    // carriers (posição no aro) + fade em 50%
    const sunCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: -R }],
      opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));

    const moonCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: R }],
      opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    // progresso do Lottie sincronizado com o corte em 50%
    const sunAnimatedProps = useAnimatedProps(() => ({
      progress: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));
    const moonAnimatedProps = useAnimatedProps(() => ({
      progress: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        {/* opcional: aro */}
        <View pointerEvents="none" style={[
          StyleSheet.absoluteFill,
          { borderRadius: HALF }
        ]} />

        {/* eixo que gira */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, axisStyle]}>
          {/* sol no topo */}
          <Animated.View style={[styles.center, sunCarrier, { position: 'absolute' }]} pointerEvents="none">
            <Animated.View style={[uprightStyle, { width: iconSize, height: iconSize }]}>
              <AnimatedLottie
                source={require('../../assets/lottie/sun.json')}
                animatedProps={sunAnimatedProps}
                autoPlay={false}
                loop={false}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </Animated.View>

          {/* lua embaixo */}
          <Animated.View style={[styles.center, moonCarrier, { position: 'absolute' }]} pointerEvents="none">
            <Animated.View style={[uprightStyle, { width: iconSize, height: iconSize }]}>
              <AnimatedLottie
                source={require('../../assets/lottie/moon.json')}
                animatedProps={moonAnimatedProps}
                autoPlay={false}
                loop={false}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
});