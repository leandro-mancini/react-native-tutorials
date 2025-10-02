import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  // valores compartilhados para TODO o bloco (título + subtítulo + botões)
  const tY = useSharedValue(0);
  const op = useSharedValue(1);

  const groupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tY.value }],
    opacity: op.value,
  }));

  const goLogin = useCallback(() => {
    // anima tudo junto: sobe ~40px e some, então navega
    tY.value = withTiming(-40, { duration: 260, easing: Easing.out(Easing.cubic) });
    op.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished) runOnJS(navigation.navigate)('Login');
    });
  }, [navigation, tY, op]);

  return (
    <View style={styles.root}>
      <View style={styles.headerYellow} />
      <View style={styles.content}>
        {/* Grupo animado: título + subtítulo + botões */}
        <Animated.View style={[styles.group, groupStyle]}>
          <Text style={styles.title}>UIX University</Text>
          <Text style={styles.subtitle}>We deliver easy and simple UI/UX Videos</Text>

          <View style={styles.buttons}>
            <Pressable style={[styles.btn, styles.btnLight]} onPress={goLogin}>
              <Text style={[styles.btnText, styles.btnTextDark]}>Log in</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnDark]} onPress={() => {}}>
              <Text style={styles.btnText}>Sign up</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const YELLOW = '#f4cd1e';
const BLACK = '#111';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: YELLOW },
  headerYellow: { position: 'absolute', inset: 0, backgroundColor: YELLOW },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },

  // novo: um contêiner para agrupar o texto e os botões (anima tudo junto)
  group: { gap: 16 },

  title: { color: BLACK, fontSize: 26, fontWeight: '800' },
  subtitle: { color: BLACK, opacity: 0.8, marginBottom: 8 },

  buttons: { gap: 12, marginTop: 8 },
  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLight: { backgroundColor: '#fff' },
  btnDark: { backgroundColor: BLACK },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextDark: { color: BLACK },
});
