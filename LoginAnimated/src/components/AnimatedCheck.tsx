import React, { useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  size?: number;
  color?: string;
  duration?: number;
  trigger?: boolean; // quando true, anima o check
};

export const AnimatedCheck: React.FC<Props> = ({
  size = 72,
  color = '#fff',
  duration = 700,
  trigger = false,
}) => {
  // comprimento aproximado do path do check (ajustado empiricamente)
  const PATH_LENGTH = 160;
  const dash = useSharedValue(PATH_LENGTH);

  useEffect(() => {
    if (trigger) {
      dash.value = withTiming(0, { duration });
    } else {
      dash.value = PATH_LENGTH;
    }
  }, [trigger, duration, dash]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <AnimatedPath
        animatedProps={animatedProps as any}
        d="M20 55 L42 75 L80 30"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={PATH_LENGTH}
      />
    </Svg>
  );
};