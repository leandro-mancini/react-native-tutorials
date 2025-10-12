import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Beam } from '../components/Beam';

type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined; // rota de destino depois da animação
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// Ajuste os requires conforme sua pasta de assets
const CAR_SRC: ImageSourcePropType = require('../../assets/images/car.png');
const BEAM_SRC: ImageSourcePropType = require('../../assets/images/car.png');

export function WelcomeScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();

  // Altura aproximada do carro na composição
  const carTargetHeight = Math.min(height * 0.62, 560);
  const carAspectRatio = 750 / 1624; // ajuste se seu PNG tiver outro ratio
  const carTargetWidth = carTargetHeight * carAspectRatio;

  // --- shared values
  const carTranslateY = useSharedValue(height * 0.6);
    const beamOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(12);
  const subtitleOpacity = useSharedValue(0);

  const [isAnimatingOut, setAnimatingOut] = useState(false);

  // --- on mount animations
  useEffect(() => {
    // título
    titleOpacity.value = withDelay(
      80,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) })
    );
    titleTranslateY.value = withDelay(
      80,
      withTiming(0, { duration: 520, easing: Easing.out(Easing.quad) })
    );
    subtitleOpacity.value = withDelay(
      220,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) })
    );

    beamOpacity.value = withDelay(
    120,
    withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) })
    );

    // carro sobe para a posição final
    carTranslateY.value = withTiming(
      0,
      { duration: 700, easing: Easing.out(Easing.cubic) },
    );
  }, [carTranslateY, subtitleOpacity, titleOpacity, titleTranslateY]);

  const beamStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    transform: [{ translateY: carTranslateY.value }], // 👈 acompanha o carro
    }));

  // --- animated styles
  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: carTranslateY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  // --- handlers
  const goNext = useCallback(() => {
    navigation.replace('SignUp');
  }, [navigation]);

  const handlePrimaryPress = useCallback(() => {
    if (isAnimatingOut) return;
    setAnimatingOut(true);

    // carro sai por cima
    carTranslateY.value = withTiming(
      -(height / 2 + carTargetHeight), // sobe além do topo
      { duration: 600, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(goNext)();
      }
    );

    beamOpacity.value = withTiming(0, { duration: 300 });

    // título e subtítulo desvanecem levemente
    titleOpacity.value = withTiming(0.4, { duration: 300 });
    subtitleOpacity.value = withTiming(0.0, { duration: 280 });
  }, [
    carTranslateY,
    carTargetHeight,
    goNext,
    height,
    isAnimatingOut,
    subtitleOpacity,
    titleOpacity,
  ]);

  // beam (holofote) proporcional
  const beamSize = useMemo(
    () => ({
      w: Math.min(width * 0.86, 520),
      h: Math.min(height * 0.62, 520),
    }),
    [height, width]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B0B0B"
        translucent={false}
      />
      <View style={styles.container}>
        <Animated.View
            style={[
                beamStyle,
                {
                position: 'absolute',
                top: Math.max(24, height * 0.06),
                zIndex: 0,               // atrás
                pointerEvents: 'none' as any,
                },
            ]}
            >
            <Beam
                width={Math.min(width * 0.86, 520)}
                height={Math.min(height * 0.62, 520)}
                color="#F2C44A"
                intensity={0.6}
                style={{ transform: [{ rotate: '180deg' }] }}
            />
        </Animated.View>

        {/* títulos */}
        <Animated.Text style={[styles.title, titleStyle]}>
          Táxi dos seus sonhos
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Passeios confortáveis pela cidade
        </Animated.Text>

        {/* carro animado */}
        <Animated.View
          style={[
            carStyle,
            {
              width: carTargetWidth,
              height: carTargetHeight,
            },
          ]}
        >
          <Image
            source={CAR_SRC}
            resizeMode="contain"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* CTA principal */}
        <Pressable
          onPress={handlePrimaryPress}
          disabled={isAnimatingOut}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={['#FFD977', '#F2C44A']}
            start={{ x: 0.1, y: 0.0 }}
            end={{ x: 0.9, y: 1.0 }}
            style={[
              styles.primaryBtn,
              { width: Math.min(beamSize.w + 80, width - 32) },
            ]}
          >
            <Text style={styles.primaryText}>Inscrição aberta</Text>
          </LinearGradient>
        </Pressable>

        {/* CTA secundário */}
        <Pressable
          onPress={() => navigation.navigate('SignUp')}
          disabled={isAnimatingOut}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryText}>Criar nova conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
  },
  beam: {
    position: 'absolute',
    opacity: 0.6,
  },
  title: {
    marginTop: 80,
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  primaryBtn: {
    marginTop: 'auto',
    marginBottom: 16,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#151513',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  secondaryBtn: {
    marginBottom: Platform.select({ ios: 28, android: 22 }),
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
});