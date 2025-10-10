import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  progress: SharedValue<number>; // 0=dia, 1=noite
  size?: number;
  ringThickness?: number;
};

export const AxisDial = memo(({ progress, size = 240, ringThickness = 14 }: Props) => {
  const cx = size / 2;
  const cy = size / 2;

  // rotação do anel mapeada do progress (0..1 → -45deg..225deg, por ex.)
  const dialStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [-45, 225])}deg`,
      },
    ],
  }));

  // gesto: calcula ângulo em relação ao centro e muda progress
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const x = e.x - cx;
      const y = e.y - cy;
      const angle = Math.atan2(y, x); // -PI..PI
      // normaliza 0..1 (0° na direita; queremos que 0 seja “cima”? ajuste se quiser)
      const norm = (angle + Math.PI) / (2 * Math.PI); // 0..1 começando em -PI
      // opcional: inverter/shiftar para combinar com visual
      const mapped = (norm + 0.25) % 1; // começa no topo
      progress.value = mapped;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width: size, height: size }, styles.center]}>
        {/* ANEL */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              // borderWidth: ringThickness,
            },
            dialStyle,
          ]}
        />

        {/* MARCADORES opostos (dia/noite) */}
        
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  ring: {
    position: 'absolute',
    // borderColor: 'rgba(255,255,255,0.28)',
    // borderStyle: 'solid', // pode usar 'dashed' se quiser pontilhado
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});