import React from 'react';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Animated } from 'react-native';
import { GRID_INDEXES, DOT_R } from '../utils/geometry';
import type { Point } from '../utils/geometry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  width: number;
  height: number;
  linePoints: Point[];
  centers: Point[];
  strokeColor: string;
  dotProgress: Animated.Value[];
};

export function PatternCanvas({ width, height, linePoints, centers, strokeColor, dotProgress }: Props) {
  return (
    <Svg width={width} height={height}>
      {linePoints.length > 1 && (
        <Polyline
          points={linePoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={strokeColor}
          strokeOpacity={0.9}
          strokeWidth={4}
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
      )}
      {GRID_INDEXES.map((i) => {
        const c = centers[i];
        const rAnimated = dotProgress[i].interpolate({ inputRange: [0, 1], outputRange: [DOT_R, DOT_R * 1.6] });
        const fillOpacity = dotProgress[i].interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] });
        return (
          <React.Fragment key={i}>
            <AnimatedCircle cx={c.x} cy={c.y} r={rAnimated as any} fill="#FFFFFF" fillOpacity={fillOpacity as any} />
            <Circle cx={c.x} cy={c.y} r={DOT_R} stroke="white" strokeOpacity={0.95} strokeWidth={3} fill="transparent" />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
