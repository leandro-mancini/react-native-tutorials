import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { TransitionWave } from '../components/TransitionWave';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const YELLOW = '#f4cd1e';
const BLACK = '#111';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  // timeline da onda e da cortina
  const progress = useSharedValue(0);      // 0..1 (amplitude da onda)
  const curtainY = useSharedValue(SCREEN_H); // cortina começa fora da tela (embaixo)

  const [curtainVisible, setCurtainVisible] = useState(true);

  const height = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    // anima até 220 quando o componente monta
    height.value = withTiming(220, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  useEffect(() => {
    // sobe a cortina (bottom->top)
    curtainY.value = withTiming(0, { duration: 650, easing: Easing.out(Easing.cubic) }, (f) => {
      if (f) {
        // após a subida, podemos esconder a cortina (opcional, poupa draw)
        // com um pequeno delay para a onda “assentar”
        setTimeout(() => setCurtainVisible(false), 100);
      }
    });
    // onda “ganha vida” junto
    progress.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
  }, [curtainY, progress]);

  // conteúdo entra junto (de baixo pra cima)
  const enter = useAnimatedStyle(() => {
    'worklet';
    const t = progress.value; // 0..1
    return {
      opacity: t,
      transform: [{ translateY: (1 - t) * 24 }],
    };
  });

  return (
    <View style={styles.root}>
      {/* Conteúdo real da tela (branco) */}
      {/* <View style={{ height: 220, backgroundColor: YELLOW }}> */}
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* título fixo no header “real” */}
        <Animated.Text style={[styles.headerTitle, enter]}>
          Welcome{'\n'}Back!
        </Animated.Text>
      </Animated.View>

      <Animated.View style={[styles.form, enter]}>
        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="uixdesign.me@gmail.com"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput placeholder="••••••••" placeholderTextColor="#999" style={styles.input} secureTextEntry />
        </View>

        <Text style={styles.forgot}>Forgot password?</Text>

        <View style={{ gap: 12, marginTop: 12 }}>
          <View style={[styles.btn, styles.btnYellow]}>
            <Text style={[styles.btnText, styles.btnTextDark]}>Log in</Text>
          </View>
          <View style={[styles.or]}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>
          <View style={[styles.btn, styles.btnOutline]}>
            <Text style={styles.btnTextDark}>Sign up</Text>
          </View>
        </View>
      </Animated.View>

      {/* CORTINA por cima: cobre tudo com amarelo e tem a onda no topo */}
      {curtainVisible && (
        <TransitionWave progress={progress} translateY={curtainY} color={YELLOW} height={220} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: {
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    fontSize: 28,
    fontWeight: '800',
    color: BLACK,
  },
  form: { padding: 24, gap: 14, backgroundColor: '#fff' },
  field: { gap: 8 },
  label: { color: BLACK, opacity: 0.8 },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    color: BLACK,
  },
  forgot: { alignSelf: 'flex-end', marginTop: 8, color: '#caa40c', fontWeight: '600' },
  btn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnYellow: { backgroundColor: YELLOW },
  btnOutline: { borderWidth: 1, borderColor: BLACK },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextDark: { color: BLACK, fontWeight: '700' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  line: { flex: 1, height: 1, backgroundColor: '#eee' },
  orText: { color: '#bbb' },
});