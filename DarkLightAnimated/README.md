# Modo Dark/Light animado no React Native: um passo a passo completo

Trocar entre tema claro e escuro é comum — mas aqui vamos além: você vai construir uma experiência animada, transições suaves de cores e ícones de Sol/Lua com Lottie. Ao final, você terá uma tela polida, fluida e instrutiva para aplicar em qualquer app.

## Sumário

- [Demo](#demo)
- [Pré‑requisitos](#pré‑requisitos)
- [Instalação e configuração](#instalação-e-configuração)
  - [Dependências](#dependências)
  - [Babel e entrada do app](#babel-e-entrada-do-app)
  - [Assets (Lottie e fontes)](#assets-lottie-e-fontes)
- [Arquitetura da animação](#arquitetura-da-animação)
- [Implementação passo a passo](#implementação-passo-a-passo)
  - [Tokens de tema](#1-tokens-de-tema)
  - [Hook de alternância com animação](#2-hook-de-alternância-com-animação)
  - [Dial interativo (gestos)](#3-dial-interativo-gestos)
  - [Ícones Sun/Moon com Lottie](#4-ícones-sunmoon-com-lottie)
  - [Switch animado de tema](#5-switch-animado-de-tema)
  - [Tela de modo (composição e interpolação de cores)](#6-tela-de-modo-composição-e-interpolação-de-cores)
  - [App e entrada](#7-app-e-entrada)
- [Como executar](#como-executar)
- [Estrutura de pastas (referência)](#estrutura-de-pastas-referência)
- [Solução de problemas](#solução-de-problemas)
- [Referências](#referências)

## Demo

Insira aqui um GIF/vídeo (drag and drop no GitHub) mostrando:
- arraste o dial para ver a transição entre Sol e Lua;
- toque no switch para alternar entre Light e Dark com suavidade.

## Pré‑requisitos

- Node 20+, Java 17 (Android), Xcode + CocoaPods (iOS), Watchman (macOS)
- React Native CLI 0.82 (ou use este projeto já pronto)

## Instalação e configuração

### Dependências

No diretório do app:

```bash
npm i react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-worklets \
  lottie-react-native
```

iOS (CocoaPods):

```bash
cd ios && pod install && cd ..
```

### Babel e entrada do app

Ative os worklets do Reanimated em `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

Importe as libs nativas no topo do `index.js`:

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
```

### Assets (Lottie e fontes)

- Coloque as animações em `assets/lottie/sun.json` e `assets/lottie/moon.json`.
- Adicione fontes em `assets/fonts/` (ex.: `Montserrat-Regular.ttf`).
- Mapeie as fontes em `react-native.config.js`:

```js
module.exports = { assets: ['./assets/fonts'] };
```

- Linkar assets (uma vez):

```bash
npx react-native-asset
```

## Arquitetura da animação

O coração do projeto é um valor animado `progress` (0 → 1):
- 0 representa o modo claro; 1, o modo escuro.
- Interpolamos cores de fundo e texto com `interpolateColor`.
- O dial ajusta `progress` por gesto (Pan) — oferecemos controle manual.
- O switch dispara `toggle()` e animamos `progress` com `withTiming`.
- Ícones Sun/Lua (Lottie) alternam opacidade e tempo de animação conforme `progress`.

Essa separação (estado → progress → efeitos) mantém o código limpo e previsível.

## Implementação passo a passo

Abaixo, os arquivos completos com comentários importantes.

### 1) Tokens de tema

Arquivo: `src/theme/tokens.ts`

```ts
export const tokens = {
  light: {
    bg: '#FFFFFF',
    text: '#111111',
    card: '#F7F7F7',
    track: '#D9D9D9',
    knob: '#FFFFFF',
    accent: '#3B82F6',
  },
  dark: {
    bg: '#0E0E0E',
    text: '#FFFFFF',
    card: '#111318',
    track: '#2B2B2B',
    knob: '#FFFFFF',
    accent: '#3B82F6',
  },
} as const;
```

### 2) Hook de alternância com animação

Arquivo: `src/theme/useThemeMode.ts`

```ts
import { useCallback, useMemo, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export type ThemeMode = 'light' | 'dark';

export function useThemeMode(initial: ThemeMode = 'light') {
  const [mode, setMode] = useState<ThemeMode>(initial);
  const progress = useSharedValue(initial === 'dark' ? 1 : 0);

  const toggle = useCallback(() => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    progress.value = withTiming(next === 'dark' ? 1 : 0, { duration: 650 });
  }, [mode, progress]);

  return useMemo(() => ({ mode, toggle, progress }), [mode, toggle, progress]);
}
```

### 3) Dial interativo (gestos)

Arquivo: `src/components/AxisDial.tsx`

```tsx
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  progress: SharedValue<number>;
  size?: number;
  ringThickness?: number;
};

export const AxisDial = memo(({ progress, size = 240, ringThickness = 14 }: Props) => {
  const cx = size / 2;
  const cy = size / 2;

  const dialStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [-45, 225])}deg`,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const x = e.x - cx;
      const y = e.y - cy;
      const angle = Math.atan2(y, x);
      const norm = (angle + Math.PI) / (2 * Math.PI);
      const mapped = (norm + 0.25) % 1;
      progress.value = mapped;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width: size, height: size }, styles.center]}>
        <Animated.View
          style=[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            dialStyle,
          ]
        />
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  ring: {
    position: 'absolute',
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
```

Dica: estilize `ring` como preferir (gradiente, bordas, sombras). O exemplo deixa a camada disponível para sua criatividade.

### 4) Ícones Sun/Moon com Lottie

Arquivo: `src/components/SunMoon.tsx`

```tsx
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

type Props = {
  progress: SharedValue<number>;
  size?: number;
  ringThickness?: number;
  iconSize?: number;
  angleStartDeg?: number;
  angleEndDeg?: number;
};

const AnimatedLottie = Animated.createAnimatedComponent(LottieView);

export const SunMoon = memo(({
  progress,
  size = 260,
  ringThickness = 14,
  iconSize = 200,
  angleStartDeg = -90,
  angleEndDeg = 90,
}: Props) => {
    const HALF = size / 2;
    const R = HALF - ringThickness / 2;

    const axisAngle = useDerivedValue(() =>
      interpolate(progress.value, [0, 1], [angleStartDeg, angleEndDeg])
    );

    const axisStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${axisAngle.value}deg` }],
    }));

    const uprightStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${-axisAngle.value}deg` }],
    }));

    const sunCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: -R }],
      opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));

    const moonCarrier = useAnimatedStyle(() => ({
      transform: [{ translateY: R }],
      opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    const sunAnimatedProps = useAnimatedProps(() => ({
      progress: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));
    const moonAnimatedProps = useAnimatedProps(() => ({
      progress: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    }));

    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <View pointerEvents="none" style=[
          StyleSheet.absoluteFill,
          { borderRadius: HALF }
        ] />

        <Animated.View style={[StyleSheet.absoluteFill, styles.center, axisStyle]}>
          <Animated.View style={[styles.center, sunCarrier, { position: 'absolute' }]} pointerEvents="none">
            <Animated.View style={[uprightStyle, { width: iconSize, height: iconSize }]}>
              <AnimatedLottie
                source={require('../../assets/lottie/sun.json')}
                animatedProps={sunAnimatedProps}
                autoPlay={true}
                loop={true}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.center, moonCarrier, { position: 'absolute' }]} pointerEvents="none">
            <Animated.View style={[uprightStyle, { width: iconSize, height: iconSize }]}>
              <AnimatedLottie
                source={require('../../assets/lottie/moon.json')}
                animatedProps={moonAnimatedProps}
                autoPlay={true}
                loop={true}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
});
```

A dupla rotação mantém os ícones “em pé” enquanto o eixo gira. As opacidades trocam em 0.5 do `progress`.

### 5) Switch animado de tema

Arquivo: `src/components/ThemeToggle.tsx`

```tsx
import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated,
{
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { tokens } from '../theme/tokens';

type Props = {
  progress: SharedValue<number>;
  onToggle(): void;
  width?: number;
  height?: number;
};

export const ThemeToggle = memo(({ progress, onToggle, width = 180, height = 100 }: Props) => {
  const R = height / 2;
  const PADDING = Math.max(6, Math.round(height * 0.125));
  const KNOB = height - PADDING * 2;
  const INNER_DOT = Math.round(KNOB * 0.46);

  const pressed = useSharedValue(0);

  const trackStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      ['#D6D6D6', tokens.dark.accent]
    );
    return { backgroundColor: bg };
  });

  const knobStyle = useAnimatedStyle(() => {
    const x = interpolate(
      progress.value,
      [0, 1],
      [PADDING, width - KNOB - PADDING],
      Extrapolation.CLAMP
    );

    const scale = withSpring(1 + pressed.value * 0.06, { mass: 0.35, stiffness: 280, damping: 20 });

    return {
      transform: [{ translateX: x }, { scale }],
    };
  });

  const innerDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.15], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: progress.value >= 0.5 }}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={onToggle}
      style={{ alignSelf: 'center' }}
    >
      <Animated.View style={[styles.track, { width, height, borderRadius: R }, trackStyle]}>
        <Animated.View
          style=[
            styles.knob,
            {
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              left: 0,
              top: PADDING,
              backgroundColor: '#FFFFFF',
            },
            knobStyle,
          ]
        >
          <Animated.View
            style=[
              {
                width: INNER_DOT,
                height: INNER_DOT,
                borderRadius: INNER_DOT / 2,
                backgroundColor: '#C7C7C7',
              },
              innerDotStyle,
            ]
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halo: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});
```

Dicas de UX: dê feedback tátil (Haptics) ao alternar; ajuste cores para alto contraste no modo escuro.

### 6) Tela de modo (composição e interpolação de cores)

Arquivo: `src/ModeScreen.tsx`

```tsx
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
```

### 7) App e entrada

Arquivo: `App.tsx`

```tsx
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModeScreen from './src/ModeScreen';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ModeScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
```

Arquivo: `index.js`

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

## Como executar

```bash
npm install
cd ios && pod install && cd ..
npx react-native-asset
npm run start
npm run ios      # ou
npm run android
```

## Estrutura de pastas (referência)

```
DarkLightAnimated/
  App.tsx
  index.js
  babel.config.js
  metro.config.js
  react-native.config.js
  assets/
    fonts/ (Montserrat-Regular.ttf, ...)
    lottie/ (sun.json, moon.json)
  src/
    ModeScreen.tsx
    components/
      AxisDial.tsx
      SunMoon.tsx
      ThemeToggle.tsx
    theme/
      tokens.ts
      useThemeMode.ts
```

## Solução de problemas

- Reanimated/Worklets: verifique o plugin em `babel.config.js` e as importações no `index.js`.
- Lottie no iOS: sempre rode `pod install` após instalar/atualizar dependências nativas.
- Gesture Handler: envolva a árvore com `GestureHandlerRootView` (feito em `App.tsx`).
- Cache do Metro: se notar erros de resolução/links, limpe o cache:

```bash
npm start -- --reset-cache
```

- Fontes: rode `npx react-native-asset` e reinstale o app.

## Referências

- React Native: https://reactnative.dev/
- Reanimated + Worklets: https://docs.swmansion.com/react-native-reanimated/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- Lottie React Native: https://github.com/lottie-react-native/lottie-react-native
