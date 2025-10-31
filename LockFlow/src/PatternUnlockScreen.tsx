import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { usePatternLock } from './pattern/hooks/usePatternLock';
import { PatternCanvas } from './pattern/components/PatternCanvas';

export type Props = {
  registeredPattern: number[];
  onSuccess?: () => void;
  onFail?: () => void;
  showDebug?: boolean;
};

export function PatternUnlockScreen({ registeredPattern, onSuccess, onFail, showDebug = false }: Props) {
  const {
    selected,
    status,
    linePoints,
    dotProgress,
    BOX_SIZE,
    centers,
    frameScale,
    frameOpacity,
    haloScale,
    panHandlers,
  } = usePatternLock({ registeredPattern, onSuccess, onFail });

  const strokeColor =
    status === 'ok' ? '#22C55E' :
    status === 'fail' ? '#EF4444' :
    'rgba(255,255,255,0.95)';

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.backHalo, { transform: [{ scale: haloScale }] }]} />

      <Animated.View style={[styles.phoneFrame, { transform: [{ scale: frameScale }], opacity: frameOpacity }]}>
        <View
          pointerEvents="box-only"
          collapsable={false}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ width: BOX_SIZE, height: BOX_SIZE, alignSelf: 'center' }}
          {...panHandlers}
        >
          <PatternCanvas
            width={BOX_SIZE}
            height={BOX_SIZE}
            linePoints={linePoints}
            centers={centers}
            strokeColor={strokeColor}
            dotProgress={dotProgress}
          />
        </View>

        {showDebug && (
          <Text style={styles.debug}>captured: [{selected.join(', ')}]</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D80FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHalo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  phoneFrame: {
    width: 340,
    borderRadius: 32,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#108CFF',
    alignItems: 'center',
  },
  debug: {
    marginTop: 8,
    color: '#EAF2FF',
    opacity: 0.8,
    fontSize: 12,
  },
});
