import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { AnimatedGradient } from '../components/AnimatedGradient';
import { MicroButton } from '../components/MicroButton';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { AnimatedCheck } from '../components/AnimatedCheck';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CARD_W = 360;
const CARD_H = 300;
const CIRCLE = 120;
const RADIUS = 20;

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [done, setDone] = useState(false); // controla o check
  const [animating, setAnimating] = useState(false);

  // shared values para morph, opacidades e transição final
  const w = useSharedValue(CARD_W);
  const h = useSharedValue(CARD_H);
  const r = useSharedValue(RADIUS);
  const ty = useSharedValue(0); // translateY do card (sobe a bolinha)

  const contentOpacity = useSharedValue(1);
  const checkOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const footerOpacity = useSharedValue(1);

  // estilos animados
  const cardStyle = useAnimatedStyle(() => ({
    width: w.value,
    height: h.value,
    borderRadius: r.value,
    transform: [{ translateY: ty.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkOpacity.value }], // pop-in
  }));

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const footerStyle = useAnimatedStyle(() => ({ opacity: footerOpacity.value }));

  // reseta para regravar a demo, se quiser
  const reset = useCallback(() => {
    setAnimating(false);
    setDone(false);
    w.value = CARD_W;
    h.value = CARD_H;
    r.value = RADIUS;
    ty.value = 0;
    contentOpacity.value = 1;
    checkOpacity.value = 0;
    headerOpacity.value = 1;
    footerOpacity.value = 1;
  }, [w, h, r, ty, contentOpacity, checkOpacity, headerOpacity, footerOpacity]);

  const onSubmit = useCallback(() => {
    if (animating) return;
    setAnimating(true);

    const fadeCfg = { duration: 220 };

    // 1) fade-out do conteúdo + header + footer
    contentOpacity.value = withTiming(0, fadeCfg);
    headerOpacity.value = withTiming(0, fadeCfg);
    footerOpacity.value = withTiming(0, fadeCfg);

    // 2) morph do card: aproxima quadrado e depois círculo
    w.value = withSequence(
      withTiming(CARD_H, { duration: 260, easing: Easing.out(Easing.cubic) }),
      withTiming(CIRCLE, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    h.value = withSequence(
      withTiming(CARD_H, { duration: 260, easing: Easing.out(Easing.cubic) }),
      withTiming(CIRCLE, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    r.value = withTiming(CIRCLE / 2, {
      duration: 560,
      easing: Easing.out(Easing.cubic),
    });

    // 3) pop-in do check e desenhar path
    checkOpacity.value = withDelay(
      520,
      withTiming(
        1,
        { duration: 300, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(setDone)(true);

            // 4) aguarda alguns ms, sobe a bolinha e expande para tela cheia
            // ajuste o delay para controlar a "pausa dramática" após o check
            setTimeout(() => {
              // 4.1) sobe levemente a bolinha
              ty.value = withTiming(-SCREEN_H * 0.18, {
                duration: 450,
                easing: Easing.out(Easing.cubic),
              });

              // 4.2) durante a subida, esconda o check
              checkOpacity.value = withDelay(
                200,
                withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) })
              );

              // 4.3) expande para tela cheia (como transição)
              const expandCfg = { duration: 300, easing: Easing.inOut(Easing.cubic) };
              w.value = withDelay(100, withTiming(SCREEN_W, expandCfg));
              h.value = withDelay(100, withTiming(SCREEN_H, expandCfg));
              r.value = withDelay(100, withTiming(0, expandCfg));
              ty.value = withDelay(100, withTiming(0, expandCfg)); // recentra ao expandir

              // 4.4) (opcional) após a expansão, faça navegação ou reset
              // setTimeout(() => runOnJS(reset)(), 900);
            }, 2000); // <— pausa após o check (ajuste a gosto)
          }
        }
      )
    );
  }, [
    animating,
    contentOpacity,
    headerOpacity,
    footerOpacity,
    w,
    h,
    r,
    ty,
    checkOpacity,
    reset,
  ]);

  return (
    <AnimatedGradient>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.root}
      >
        {/* Header com fade */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>
        </Animated.View>

        {/* Centro: card com morph e transição */}
        <View style={styles.center}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            {/* base translúcida */}
            <View style={styles.cardBase} />
            {/* blur por cima (ignora toques) */}
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={12}
              pointerEvents="none"
            />
            {/* conteúdo do formulário (bloqueia toques durante animação) */}
            <Animated.View
              style={[styles.cardContent, contentStyle]}
              pointerEvents={animating ? 'none' : 'auto'}
            >
              <View style={styles.field}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  placeholder="voce@email.com"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={{ height: 14 }} />

              <View style={styles.field}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={pwd}
                  onChangeText={setPwd}
                  secureTextEntry
                />
              </View>

              <View style={{ height: 20 }} />

              <MicroButton label="Entrar" onPress={onSubmit} />
            </Animated.View>

            {/* check central (não intercepta toques) */}
            <Animated.View style={[styles.checkContainer, checkStyle]} pointerEvents="none">
              <AnimatedCheck size={56} color="#fff" trigger={done} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Footer com fade */}
        <Animated.Text style={[styles.footer, footerStyle]}>
          Esqueceu a senha?
        </Animated.Text>
      </KeyboardAvoidingView>
    </AnimatedGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 28 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 16 },

  // IMPORTANTE: flex:1 + center para permitir a expansão a tela cheia
  center: { alignItems: 'center' },

  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    // sombras
    shadowColor: '#000',
    shadowRadius: 16,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardBase: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  cardContent: {
    position: 'absolute',
    inset: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
  },

  field: {},
  label: { color: 'rgba(255,255,255,0.85)', marginBottom: 8, fontWeight: '600' },
  input: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  checkContainer: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: { color: '#fff', textAlign: 'center', marginTop: 16, opacity: 0.9 },
});