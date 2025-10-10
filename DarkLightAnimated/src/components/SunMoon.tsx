import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

type Props = {
  progress: SharedValue<number>;
  size?: number;
  ringThickness?: number;
  iconSize?: number;
  /** ângulos em GRAUS para mapear 0→1 do progress */
  angleStartDeg?: number; // padrão: -90 (sol no topo)
  angleEndDeg?: number;   // padrão:  90 (lua embaixo)
};

const AnimatedLottie = Animated.createAnimatedComponent(LottieView);

export const SunMoon = memo(({
  progress,
  size = 260,
  ringThickness = 14,
  iconSize = 200,
  angleStartDeg = -90, // 👈 ajuste aqui
  angleEndDeg   =  90, // 👈 ajuste aqui
}: Props) => {
    const HALF = size / 2;
    // raio até a "linha central" do aro (fica perfeito na borda)
    const R = HALF - ringThickness / 2;

    // O frame rotaciona i.e. “eixo” girando
    // ajuste o range de rotação para a sensação desejada (p.ex. -90deg → 90deg)
    const axisStyle = useAnimatedStyle(() => ({
        transform: [
        {
            rotate: `${interpolate(
            progress.value,
            [0, 1],
            [angleStartDeg, angleEndDeg]  // 👈 usa os ângulos configuráveis
            )}deg`,
        },
        ],
    }));

    // O Sol fica no topo do eixo (translateY negativo)
    const sunCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: -R }],
      opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));

    // A Lua fica na base do eixo (translateY positivo)
    const moonCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: R }],
      opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    // Progresso do Lottie no UI thread
    const sunAnimatedProps = useAnimatedProps(() => ({
      // 1 → 0 entre 0..0.5
      progress: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));
    const moonAnimatedProps = useAnimatedProps(() => ({
      // 0 → 1 entre 0.5..1
      progress: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        {/* ARO opcional (só visual). Se já tem um componente de aro separado, remova este bloco */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            // {
            //   borderRadius: HALF,
            //   borderWidth: ringThickness,
            //   borderColor: 'rgba(255,255,255,0.28)',
            // },
          ]}
        />

        {/* FRAME que rotaciona todo o eixo */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, axisStyle]}>
          {/* SUN no topo do eixo */}
          <Animated.View
            style={[
              styles.center,
              sunCarrier,
              { width: iconSize, height: iconSize, position: 'absolute' },
            ]}
            pointerEvents="none"
          >
            <AnimatedLottie
              source={require('../../assets/lottie/sun.json')}
              animatedProps={sunAnimatedProps}
              autoPlay={false}
              loop={false}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          </Animated.View>

          {/* MOON na base do eixo */}
          <Animated.View
            style={[
              styles.center,
              moonCarrier,
              { width: iconSize, height: iconSize, position: 'absolute' },
            ]}
            pointerEvents="none"
          >
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
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
});