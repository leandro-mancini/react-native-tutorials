import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { Dot } from './Dot';
import { NextIconButton } from './NextIconButton';

export function Footer({ x, pagerRef, total, width, onFinish, onNext }: {
  x: SharedValue<number>;
  pagerRef: React.RefObject<any>;
  total: number;
  width: number;
  onFinish?: () => void;
  onNext?: () => void;
}) {
  const getIndex = () => Math.round(x.value / width);

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }

    const i = getIndex();
    if (i < total - 1) {
      pagerRef.current?.scrollToIndex?.({ index: i + 1, animated: true });
    } else {
      onFinish?.();
    }
  };

  return (
    <View style={styles.footerRow}>
      <View style={styles.footerLeft}>
        <View style={styles.dotsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <Dot key={i} index={i} x={x} width={width} />
          ))}
        </View>
      </View>

      <NextIconButton onPress={handleNext} progressX={x} total={total} width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    alignItems: 'flex-start',
  },
  dotsRow: {
    height: 22,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
});
