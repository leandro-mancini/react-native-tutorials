import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { WaveHeader } from '../components/WaveHeader';

const { width } = Dimensions.get('window');
const YELLOW = '#f4cd1e';
const BLACK = '#111';

export const LoginScreen: React.FC = () => {
  const op = useSharedValue(0);
  const ty = useSharedValue(24);

  useEffect(() => {
    // entra de baixo com fade
    op.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    ty.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, [op, ty]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateY: ty.value }],
  }));

  return (
    <View style={styles.root}>
      {/* Header amarelo com onda branca animada */}
      <View style={{ height: 220, backgroundColor: YELLOW }}>
        <WaveHeader width={width} height={220} color={YELLOW} />
        <Text style={styles.headerTitle}>Welcome{'\n'}Back!</Text>
      </View>

      <Animated.View style={[styles.form, contentStyle]}>
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

        {/* Botões */}
        <View style={{ gap: 12, marginTop: 12 }}>
          <View style={[styles.btn, styles.btnYellow]}>
            <Text style={[styles.btnText, styles.btnTextDark]}>Log in</Text>
          </View>
          <View style={[styles.or]}>
            <View style={styles.line} /><Text style={styles.orText}>or</Text><View style={styles.line} />
          </View>
          <View style={[styles.btn, styles.btnOutline]}>
            <Text style={styles.btnTextDark}>Sign up</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { position: 'absolute', left: 24, bottom: 24, fontSize: 28, fontWeight: '800', color: BLACK },
  form: { padding: 24, gap: 14 },
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
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { color: '#999' },
});