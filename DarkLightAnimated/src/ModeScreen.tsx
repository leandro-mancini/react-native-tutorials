import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { SunMoon } from './components/SunMoon';
import { ThemeToggle } from './components/ThemeToggle';
import { tokens } from './theme/tokens';
import { useThemeMode } from './theme/useThemeMode';
import { AxisDial } from './components/AxisDial';

const ModeScreen = memo(() => {
  const { mode, progress, toggle } = useThemeMode('light');

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [tokens.light.bg, tokens.dark.bg]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [tokens.light.text, tokens.dark.text]),
  }));

  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={[styles.fill, bgStyle, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ translateY: 100 }] }}>
          <AxisDial progress={progress} size={260} ringThickness={12} />
          <View style={{ position: 'absolute' }}>
              <SunMoon progress={progress} angleStartDeg={0} angleEndDeg={180} />
          </View>
        </View>
        <Animated.Text style={[styles.title, textStyle]}>
          {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Animated.Text>
        <ThemeToggle progress={progress} onToggle={toggle} />
      </SafeAreaView>
    </Animated.View>
  );
});

export default ModeScreen;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 28 },
  title: { fontSize: 30, fontFamily: 'Montserrat-Regular', textAlign: 'center' },
});