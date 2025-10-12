import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Headlights } from '../components/Headlights';

const { height: H, width: W } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export function StartScreen({ navigation }: Props) {
  // posição vertical do carro (entrada e saída)
  const carY = useSharedValue(H * 0.6); // começa fora da tela (abaixo)
  const carOpacity = useSharedValue(0);

  // micro interação do botão
  const btnScale = useSharedValue(1);

  // guarda estado pra impedir duplo toque
  const navigatingRef = useRef(false);

  const [wrapFrame, setWrapFrame] = React.useState<{x:number;y:number;w:number;h:number}|null>(null);
    const [carFrame,  setCarFrame]  = React.useState<{x:number;y:number;w:number;h:number}|null>(null);

  const onWrapLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setWrapFrame({ x, y, w: width, h: height }); // posição do carWrap na tela
    };

    const onCarLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setCarFrame({ x, y, w: width, h: height });  // posição do Image dentro do carWrap
    };

  React.useEffect(() => {
    const finalY = 140;

    // animação de entrada ao montar
    carY.value = withTiming(finalY, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
    });
    carOpacity.value = withDelay(
      90,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
  }, [carY, carOpacity]);

  const goNext = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    // 1) micro interação de clique
    btnScale.value = withTiming(0.96, { duration: 90 }, () => {
      btnScale.value = withTiming(1, { duration: 120 });
    });

    // 2) carro sai pra cima e some → navega
    carOpacity.value = withTiming(0.2, { duration: 450 });
    carY.value = withTiming(-H, { duration: 700, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(navigation.replace)('Next'); // só troca de rota após a saída
    });
  }, [navigation, btnScale, carOpacity, carY]);

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: carY.value }],
    opacity: carOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Headline */}
      <View style={styles.hero}>
        <Text style={styles.title}>Táxi dos seus sonhos</Text>
        <Text style={styles.subtitle}>Passeios confortáveis pela cidade</Text>
      </View>

      {/* Carro */}
      <Animated.View style={[styles.carWrap, carStyle]} onLayout={onWrapLayout}>
        {/* Faróis: só renderiza quando sabemos as medidas do carro */}
        {wrapFrame && carFrame && (
            <Headlights
                // posições convertidas para o espaço da TELA
                originY={
                wrapFrame.y + (carFrame.y + carFrame.h * 0.36) // ~linha do para-choque
                }
                cxLeft ={ wrapFrame.x + (carFrame.x + carFrame.w * 0.36) } // farol esquerdo
                cxRight={ wrapFrame.x + (carFrame.x + carFrame.w * 0.64) } // farol direito

                // alcance do feixe para cima até quase encostar no topo da tela
                beamHeight={ (wrapFrame.y + (carFrame.y + carFrame.h * 0.36)) - 12 }

                // abertura no topo do feixe em função da largura do dispositivo
                bottomWidth={ Dimensions.get('window').width * 0.94 }
            />
        )}

        <Image
            source={require('../../assets/images/car.png')}
            style={styles.car}
            resizeMode="contain"
            onLayout={onCarLayout}
        />
        </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.ctaShadow, buttonStyle]}>
        <Pressable onPress={goNext} android_ripple={{ color: 'rgba(0,0,0,0.08)' }}>
          <LinearGradient
            colors={['#F8D46A', '#F3B73F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Inscrição aberta</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* link secundário (mock) */}
      <Text style={styles.link}>Criar nova conta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0E', paddingTop: 24 },
  
  hero: { paddingHorizontal: 24, marginTop: 48, marginBottom: 12 },
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center'
  },
  subtitle: { color: '#BEBEBE', fontSize: 16, textAlign: 'center', fontFamily: 'Montserrat-Medium' },

  carWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  car: {
    width: '100%',
    height: '100%',
  },

  beamLeft: {
    position: 'absolute',
    // ponto de origem logo abaixo do carro — ajuste fino se necessário
    top: H * 0.28,
    left: -W * 0.02,
    width: W * 0.50,   // base larga
    height: H * 0.85,  // vai até o rodapé
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    transform: [
      { rotate: '-8deg' },
      { skewX: '-8deg' }, // dá o "afinamento" no topo
      { translateY: 0 },
    ],
  },
  beamRight: {
    position: 'absolute',
    top: H * 0.28,
    right: -W * 0.02,
    width: W * 0.50,
    height: H * 0.85,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    transform: [
      { rotate: '8deg' },
      { skewX: '8deg' },
      { translateY: 0 },
    ],
  },

  ctaShadow: {
    marginHorizontal: 24,
    marginBottom: 14,
    borderRadius: 28,
    overflow: 'hidden',
  },
  cta: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#151513',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  link: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
});