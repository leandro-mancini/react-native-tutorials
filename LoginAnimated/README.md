# LoginAnimated — Tutorial passo a passo para criar a interface de login animada (React Native)

Este guia em formato de blog mostra, passo a passo, como montar a interface do app LoginAnimated: instalar bibliotecas, configurar o projeto, criar os componentes base, montar as telas e ajustar as animações.

## Sumário

- [Pré‑requisitos](#pré‑requisitos)
- [Passo 1 — Instalar dependências](#passo-1--instalar-dependências)
- [Passo 2 — Configurar Babel e entrada do app](#passo-2--configurar-babel-e-entrada-do-app)
- [Passo 3 — Adicionar assets (Lottie e fontes)](#passo-3--adicionar-assets-lottie-e-fontes)
- [Passo 4 — Configurar navegação](#passo-4--configurar-navegação)
- [Como executar](#como-executar)
- [Solução de problemas](#solução-de-problemas)
- [Estrutura final de arquivos (referência)](#estrutura-final-de-arquivos-referência)
- [Códigos completos](#códigos-completos)
- [Referências](#referências)

## Demos (GIFs)

Coloque GIFs em `docs/` para ilustrar as transições:

- Landing: ![Landing](./docs/landing.gif)
- CTAs (LoginScreen): ![CTAs](./docs/login-ctas.gif)
- Formulário (LoginForm): ![Login Form](./docs/login-form.gif)

Dica rápida (opcional): grave a tela do simulador e gere GIFs. Ex.: grave com QuickTime e converta com ffmpeg.

```bash
# converter um .mov gravado do simulador para .gif
ffmpeg -i input.mov -vf "fps=30,scale=540:-1:flags=lanczos" -loop 0 output.gif
```


## Pré‑requisitos

- Node 20+, Java 17 (Android), Xcode + CocoaPods (iOS), Watchman (macOS)
- React Native CLI (ou use o projeto deste repositório)


## Passo 1 — Instalar dependências

No diretório do app:

```bash
npm i @react-navigation/native @react-navigation/native-stack \
  react-native-gesture-handler react-native-reanimated react-native-screens \
  react-native-safe-area-context lottie-react-native lucide-react-native \
  react-native-material-ripple react-native-svg react-native-linear-gradient \
  @react-native-community/blur react-native-worklets
```

iOS (CocoaPods):

```bash
cd ios && pod install && cd ..
```


## Passo 2 — Configurar Babel e entrada do app

Arquivo `babel.config.js` (habilita Worklets/Reanimated):

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

Arquivo `index.js` (polyfills no topo):

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
```


## Passo 3 — Adicionar assets (Lottie e fontes)

- Coloque suas animações em `assets/lotties/` (ex.: `buildings.json`, `car.json`, `tree.json`).
- Adicione fontes em `assets/fonts/` (ex.: `Inter-Regular.ttf`, `Montserrat-Regular.ttf`).
- Garanta o mapeamento em `react-native.config.js`:

```js
module.exports = { assets: ['./assets/fonts'] };
```

- Linkar assets (uma vez):

```bash
npx react-native-asset
```


## Passo 4 — Configurar navegação

Crie `src/navigation.tsx` com um Stack sem header (animações ficam com o Reanimated):

```tsx
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="LoginForm" component={LoginFormScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

No `App.tsx`, apenas exporte o `RootNavigator`.

## Como executar

```bash
npm install
cd ios && pod install && cd ..
npx react-native-asset
npm run start
npm run ios      # ou
npm run android
```


## Solução de problemas

- Reanimated/Worklets: confirme o plugin no `babel.config.js`.
- Metro: limpe cache se notar glitches:

```bash
npm start -- --reset-cache
```

- iOS Pods: após alterar libs nativas:

```bash
cd ios && pod install
```

- Fontes: rode `npx react-native-asset` e reinstale o app se não aplicar.


## Estrutura final de arquivos (referência)

```
LoginAnimated/
  App.tsx
  index.js
  babel.config.js
  react-native.config.js
  assets/
    fonts/ (Inter, Montserrat)
    lotties/ (buildings.json, car.json, tree.json)
  src/
    navigation.tsx
    components/
      WhiteSlope.tsx
      City.tsx
      Tree.tsx
      Car.tsx
      ButtonPrimary.tsx
      ButtonSecondary.tsx
      ButtonToggle.tsx
    screens/
      LandingScreen.tsx
      LoginScreen.tsx
      LoginFormScreen.tsx
```


## Códigos completos

### App.tsx

```tsx
import { RootNavigator } from './src/navigation';

export default function App() {
  return <RootNavigator />;
}
```

### index.js

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### src/navigation.tsx

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { LoginFormScreen } from './screens/LoginFormScreen';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  LoginForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginForm" component={LoginFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Componentes

#### src/components/WhiteSlope.tsx

```tsx
import React from "react";
import { Dimensions, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");

type Props = {
  color?: string;              // cor da faixa
  bleed?: number;              // sobra lateral para cobrir bordas
  height?: number;             // altura do “cap” quando não-esticado
  slope?: number;              // inclinação (diferença entre topo esq e topo dir)
  anchor?: "top" | "bottom";   // onde ancorar dentro do container
  stretch?: boolean;           // se true, estica no eixo Y (ocupa 100% da altura do container)
  style?: StyleProp<ViewStyle>;
};

export const WhiteSlope: React.FC<Props> = ({
  color = "#fff",
  bleed = 40,
  height = 177,
  slope = 30,
  anchor = "bottom",
  stretch = false,
  style,
}) => {
  const W = SCREEN_W + bleed * 2;
  const VP_H = stretch ? 100 : height;

  // Borda inclinada no topo do path
  const d = `M0,${slope} L${W},0 L${W},${VP_H} L0,${VP_H} Z`;

  const svgStyle: any = [
    { position: "absolute", left: -bleed },
    anchor === "bottom" ? { bottom: 0 } : { top: 0 },
    style,
  ];

  return (
    <Svg
      style={svgStyle}
      width={W}
      height={stretch ? ("100%" as any) : height}
      viewBox={`0 0 ${W} ${VP_H}`}
      preserveAspectRatio={stretch ? "none" : "xMidYMid slice"}
    >
      <Path d={d} fill={color} />
    </Svg>
  );
};
```

#### src/components/City.tsx

```tsx
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export function City({styles}: any) {
  const cityRef = useRef<LottieView>(null);

  useEffect(() => {
    cityRef.current?.play(); // começa do início
    const t = setTimeout(() => {
      cityRef.current?.pause(); // pausa no ponto atual (≈ N segundos depois)
    }, 4500); // 4.5s
    return () => clearTimeout(t);
  }, []);

  return (
    <LottieView
      ref={cityRef}
      source={require("../../assets/lotties/buildings.json")}
      autoPlay={true}
      loop={false}
      style={[StyleSheet.absoluteFill, styles]}
    />
  );
}
```

#### src/components/Tree.tsx

```tsx
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export function Tree() {
  return (
    <LottieView
        source={require("../../assets/lotties/tree.json")}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFill}
    />
  );
}
```

#### src/components/Car.tsx

```tsx
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export function Car() {
    return (
        <LottieView
            source={require("../../assets/lotties/car.json")}
            autoPlay
            loop
            style={StyleSheet.absoluteFill}
        />
    );
}
```

#### src/components/ButtonPrimary.tsx

```tsx
import { StyleSheet, Text } from "react-native";
import Ripple from "react-native-material-ripple";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export function ButtonPrimary({ onPress, text }: ButtonProps) {
  return (
    <Ripple
      rippleContainerBorderRadius={8}
      style={[styles.btn, styles.btnPrimary]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, styles.btnTextDark]}>{text}</Text>
    </Ripple>
  );
}

const styles = StyleSheet.create({
    btn: {
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnPrimary: { backgroundColor: "#F6DC00" },
    btnText: { fontSize: 14, fontFamily: "Inter-Regular" },
    btnTextDark: { color: "#050607" },
});
```

#### src/components/ButtonSecondary.tsx

```tsx
import { StyleSheet, Text } from "react-native";
import Ripple from "react-native-material-ripple";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export function ButtonSecondary({ onPress, text }: ButtonProps) {
  return (
    <Ripple
      rippleContainerBorderRadius={8}
      style={[styles.btn, styles.btnDark]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, styles.btnTextLight]}>{text}</Text>
    </Ripple>
  );
}

const styles = StyleSheet.create({
    btn: {
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnDark: { backgroundColor: "#111" },
    btnText: { fontSize: 14, fontFamily: "Inter-Regular" },
    btnTextLight: { color: "#F6DC00" },
});
```

#### src/components/ButtonToggle.tsx

```tsx
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { PressableProps } from "react-native-gesture-handler";

interface ButtonToggleProps extends PressableProps {
    onPress?: () => void;
}
export function ButtonToggle({ onPress }: ButtonToggleProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    return (
        <Pressable
            onPress={() => {
                setPasswordVisible((v) => !v);
                onPress?.();
            }}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            hitSlop={8}
        >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </Pressable>
    );
}
```

### Telas

#### src/screens/LandingScreen.tsx

```tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { WhiteSlope } from "../components/WhiteSlope";
import type { RootStackParamList } from "../navigation";
import { City } from "../components/City";
import { Tree } from "../components/Tree";
import { Car } from "../components/Car";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const { width, height } = Dimensions.get("window");
const SLOPE_H = Math.round(height * 0.38);
const CAR_W = 150;
const BLEED = 40;

// easing suave
const SOFT_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  // animações existentes
  const slopeTY = useSharedValue(SLOPE_H);
  const buildingsTY = useSharedValue(SLOPE_H * 0.5 + 60);
  const carTX = useSharedValue(-CAR_W - 32);

  // textos
  const headingTX = useSharedValue(-width * 0.6); // fora da tela à esquerda
  const headingOP = useSharedValue(0);
  const subTX = useSharedValue(-width * 0.6);
  const subOP = useSharedValue(0);

  useEffect(() => {
    // área branca / prédios / carro
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(200, withTiming(0, { duration: 700, easing: SOFT_OUT }));
    carTX.value = withDelay(300, withTiming(0, { duration: 900, easing: SOFT_OUT }));

    // textos
    headingTX.value = withDelay(
      100,
      withTiming(0, { duration: 600, easing: SOFT_OUT })
    );
    headingOP.value = withDelay(100, withTiming(1, { duration: 500 }));

    subTX.value = withDelay(
      280, // entra depois do heading
      withTiming(0, { duration: 600, easing: SOFT_OUT })
    );
    subOP.value = withDelay(280, withTiming(1, { duration: 500 }));

    // timeout opcional para navegar
    const t = setTimeout(() => {
      navigation.replace("Login");
    }, 3500);
    return () => clearTimeout(t);
  }, [navigation, slopeTY, buildingsTY, carTX, headingTX, headingOP, subTX, subOP]);

  // estilos animados
  const slopeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slopeTY.value }],
  }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: carTX.value }],
  }));
  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: headingTX.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: subTX.value }],
    opacity: subOP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos de boas-vindas */}
      <View style={styles.welcomeTextContainer}>
        <Animated.Text style={[styles.welcomeTextHeading, headingStyle]}>
          Bem-vindo!
        </Animated.Text>
        <Animated.Text style={[styles.welcomeTextSubheading, subStyle]}>
          Vamos viajar juntos
        </Animated.Text>
      </View>

      {/* prédios */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <City />
      </Animated.View>

      {/* árvore (se tiver) */}
      <Animated.View style={[styles.treeWrap, buildingsStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#fff" height={150} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6DC00", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F6DC00" },

  // textos
  welcomeTextContainer: { position: "absolute", top: 100, left: 20, zIndex: 10 },
  welcomeTextHeading: { fontSize: 32, color: "#333", fontFamily: "Inter-Regular" },
  welcomeTextSubheading: { fontSize: 16, color: "#333", fontFamily: "Inter-Regular" },

  // lottie/white slope
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: SLOPE_H, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 100, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 60, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },
});
```

#### src/screens/LoginScreen.tsx

```tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { WhiteSlope } from "../components/WhiteSlope";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { City } from "../components/City";
import { Tree } from "../components/Tree";
import { Car } from "../components/Car";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { ButtonSecondary } from "../components/ButtonSecondary";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get("window");
const SLOPE_H = Math.round(height * 0.38);
const CAR_W = 150;
const BLEED = 40;

const TEXT_START_TOP = 100;
const TEXT_TARGET_TOP = 48;
const TEXT_LIFT = TEXT_START_TOP - TEXT_TARGET_TOP;

const SOFT_OUT = Easing.bezier(.87, 0.02, 0.28, 1);

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  // fundo/elementos
  const slopeTY = useSharedValue(150);
  const buildingsTY = useSharedValue(150);
  const carTY = useSharedValue(0);

  // textos
  const headingTY = useSharedValue(0);
  const headingOP = useSharedValue(1);
  const subTY = useSharedValue(0);
  const subOP = useSharedValue(1);

  // botões (stagger)
  const btn1TY = useSharedValue(20);
  const btn1OP = useSharedValue(0);
  const btn1SC = useSharedValue(0.98);

  const btn2TY = useSharedValue(20);
  const btn2OP = useSharedValue(0);
  const btn2SC = useSharedValue(0.98);

  useEffect(() => {
    // base
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(100, withTiming(-160, { duration: 700, easing: SOFT_OUT }));
    carTY.value = withDelay(0, withTiming(-155, { duration: 750, easing: SOFT_OUT }));

    // textos
    headingTY.value = withDelay(120, withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT }));
    subTY.value     = withDelay(280, withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT }));

    // botões: entram depois do movimento principal
    const BASE = 900; // comece após carro/prédios
    const GAP  = 140; // intervalo entre botões

    // btn 1
    btn1TY.value = withDelay(BASE, withTiming(0, { duration: 420, easing: SOFT_OUT }));
    btn1OP.value = withDelay(BASE, withTiming(1, { duration: 360 }));
    btn1SC.value = withDelay(BASE, withTiming(1, { duration: 420, easing: SOFT_OUT }));

    // btn 2
    btn2TY.value = withDelay(BASE + GAP, withTiming(0, { duration: 420, easing: SOFT_OUT }));
    btn2OP.value = withDelay(BASE + GAP, withTiming(1, { duration: 360 }));
    btn2SC.value = withDelay(BASE + GAP, withTiming(1, { duration: 420, easing: SOFT_OUT }));
  }, [
    slopeTY, buildingsTY, carTY,
    headingTY, subTY,
    btn1TY, btn1OP, btn1SC,
    btn2TY, btn2OP, btn2SC
  ]);

  // animated styles
  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: carTY.value }] }));

  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headingTY.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subTY.value }],
    opacity: subOP.value,
  }));

  const btn1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: btn1TY.value }, { scale: btn1SC.value }],
    opacity: btn1OP.value,
  }));
  const btn2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: btn2TY.value }, { scale: btn2SC.value }],
    opacity: btn2OP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos */}
      <View style={styles.welcomeTextContainer}>
        <Animated.Text style={[styles.welcomeTextHeading, headingStyle]}>
          Bem-vindo!
        </Animated.Text>
        <Animated.Text style={[styles.welcomeTextSubheading, subStyle]}>
          Vamos viajar juntos
        </Animated.Text>
      </View>

      {/* prédios */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <City />
      </Animated.View>

      {/* árvore */}
      <Animated.View style={[styles.treeWrap, buildingsStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#FFF" height={310} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>

      {/* CTAs (stagger bottom→top + fade) */}
      <View style={styles.ctaWrap}>
        <Animated.View style={[styles.btnWrap, btn1Style]}>
          <ButtonPrimary text="Entrar" onPress={() => navigation.replace("LoginForm")} />
        </Animated.View>

        <Animated.View style={[styles.btnWrap, btn2Style]}>
          <ButtonSecondary text="Criar conta" onPress={() => navigation.replace("LoginForm")} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6DC00", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F6DC00" },

  // textos
  welcomeTextContainer: { position: "absolute", top: TEXT_START_TOP, left: 20, zIndex: 10 },
  welcomeTextHeading: { fontSize: 32, color: "#333", fontFamily: "Inter-Regular" },
  welcomeTextSubheading: { fontSize: 16, color: "#333", fontFamily: "Inter-Regular" },

  // lottie/white slope
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: 310, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 100, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 60, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },

  // CTAs
  ctaWrap: { position: "absolute", left: 24, right: 24, bottom: 60, gap: 14, zIndex: 20 },
  btnWrap: {}, // wrapper animável por botão
});
```

#### src/screens/LoginFormScreen.tsx

```tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Pressable, TextInput } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { WhiteSlope } from "../components/WhiteSlope";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { City } from "../components/City";
import { Tree } from "../components/Tree";
import { Car } from "../components/Car";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { ButtonSecondary } from "../components/ButtonSecondary";
import { Lock, Mail } from "lucide-react-native";
import { ButtonToggle } from "../components/ButtonToggle";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get("window");

const SLOPE_H = Math.round(height * 0.75);
const CAR_W = 150;
const BLEED = 40;

const EXIT_DX = -width * 0.6;
const TEXT_START_TOP = 100;
const TEXT_TARGET_TOP = 48;
const TEXT_LIFT = TEXT_START_TOP - TEXT_TARGET_TOP;

const SOFT_OUT = Easing.bezier(.87, 0.02, 0.28, 1);

export const LoginFormScreen: React.FC<Props> = () => {
  // fundo/elementos
  const slopeTY = useSharedValue(180);
  const buildingsTY = useSharedValue(0);
  const treeTY = useSharedValue(0);
  const carTY = useSharedValue(0);

  // textos
  const headingTX = useSharedValue(0);
  const headingOP = useSharedValue(1);
  const subTX = useSharedValue(0);
  const subOP = useSharedValue(1);

  // form
  const f1TY = useSharedValue(16), f1OP = useSharedValue(0);
  const f2TY = useSharedValue(16), f2OP = useSharedValue(0);
  const f3TY = useSharedValue(16), f3OP = useSharedValue(0); // forgot
  const f4TY = useSharedValue(16), f4OP = useSharedValue(0); // login button
  const f5TY = useSharedValue(16), f5OP = useSharedValue(0); // divider
  const f6TY = useSharedValue(16), f6OP = useSharedValue(0); // signup button
  
  // controle de visibilidade da senha
  const [passwordVisible, setPasswordVisible] = useState(false);
  

  useEffect(() => {
    // base
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(100, withTiming(-235, { duration: 700, easing: SOFT_OUT }));
    treeTY.value = withDelay(200, withTiming(-215, { duration: 700, easing: SOFT_OUT }));
    carTY.value = withDelay(0, withTiming(-190, { duration: 750, easing: SOFT_OUT }));

    // textos
    headingTX.value = withDelay(120, withTiming(EXIT_DX, { duration: 520, easing: SOFT_OUT }));
    headingOP.value = withDelay(60, withTiming(0, { duration: 500, easing: SOFT_OUT }));

    subTX.value = withDelay(280, withTiming(EXIT_DX, { duration: 520, easing: SOFT_OUT }));
    subOP.value = withDelay(140, withTiming(0, { duration: 500, easing: SOFT_OUT }));

    // form
    const BASE = 700, GAP = 110;
    const enter = (ty: any, op: any, d: number) => {
      ty.value = withDelay(BASE + d, withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }));
      op.value = withDelay(BASE + d, withTiming(1, { duration: 340 }));
    };
    enter(f1TY, f1OP, 0);          // email
    enter(f2TY, f2OP, GAP);        // password
    enter(f3TY, f3OP, GAP * 2);    // forgot
    enter(f4TY, f4OP, GAP * 3);    // login btn
    enter(f5TY, f5OP, GAP * 4);    // divider
    enter(f6TY, f6OP, GAP * 5);    // signup btn
    
  }, [
    slopeTY, buildingsTY, carTY,
    headingTX, headingOP,
    subTX, subOP,
  ]);

  // animated styles
  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const treeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: treeTY.value - 135 }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: carTY.value }] }));

  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -TEXT_LIFT }, { translateX: headingTX.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -TEXT_LIFT }, { translateX: subTX.value }],
    opacity: subOP.value,
  }));

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: f1TY.value }], opacity: f1OP.value }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: f2TY.value }], opacity: f2OP.value }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: f3TY.value }], opacity: f3OP.value }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ translateY: f4TY.value }], opacity: f4OP.value }));
  const s5 = useAnimatedStyle(() => ({ transform: [{ translateY: f5TY.value }], opacity: f5OP.value }));
  const s6 = useAnimatedStyle(() => ({ transform: [{ translateY: f6TY.value }], opacity: f6OP.value }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos */}
      <View style={styles.welcomeTextContainer}>
        <Animated.Text style={[styles.welcomeTextHeading, headingStyle]}>
          Bem-vindo!
        </Animated.Text>
        <Animated.Text style={[styles.welcomeTextSubheading, subStyle]}>
          Vamos viajar juntos
        </Animated.Text>
      </View>

      {/* prédios */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <City />
      </Animated.View>

      {/* árvore */}
      <Animated.View style={[styles.treeWrap, treeStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#FFF" height={500} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        <View style={{ flex: 1 }}>
            <Animated.View style={s1}>
                <View style={styles.inputRow}>
                    <Mail size={18} />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#777"
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                </View>
                <View style={styles.underline} />
            </Animated.View>

            <Animated.View style={[{ marginTop: 18 }, s2]}>
                <View style={styles.inputRow}>
                    <Lock size={18} />
                    <TextInput placeholder="Senha" secureTextEntry={!passwordVisible} placeholderTextColor="#777" style={styles.input} />
                    <ButtonToggle onPress={() => setPasswordVisible((v) => !v)} />
                </View>
                <View style={styles.underline} />
            </Animated.View>

            <Animated.View style={[{ alignItems: "flex-end", marginTop: 10 }, s3]}>
                <Pressable onPress={() => {}}>
                    <Text style={styles.forgot}>Forgot password?</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[{ marginTop: 22 }, s4]}>
              <ButtonPrimary text="Entrar" onPress={() => { /* autenticar */ }} />
            </Animated.View>
        </View>

        <Animated.View style={[styles.dividerWrap, s5]}>
          <View style={styles.divider} />
          <Text style={{ color: "#bbb", marginHorizontal: 10, fontFamily: "Montserrat-Regular" }}>ou</Text>
          <View style={styles.divider} />
        </Animated.View>

        <Animated.View style={[s6]}>
          <ButtonSecondary text="Criar conta" onPress={() => { /* ir para signup */ }} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6DC00", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F6DC00" },

  // textos
  welcomeTextContainer: { position: "absolute", top: TEXT_START_TOP, left: 20, zIndex: 10 },
  welcomeTextHeading: { fontSize: 32, color: "#333", fontWeight: "700" },
  welcomeTextSubheading: { fontSize: 16, color: "#333" },

  // lottie/white slope
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: 500, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 215, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 215, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },

  // Form
  form: { position: "absolute", left: 24, right: 24, bottom: 24, zIndex: 5, display: 'flex', flexDirection: 'column', height: 380 },
  inputRow: { height: 46, flexDirection: "row", alignItems: "center", gap: 10, },
  input: { flex: 1, fontSize: 16, color: "#111", fontFamily: "Montserrat-Regular" },
  underline: { height: 1, backgroundColor: "#111" },
  forgot: { color: "#666", fontFamily: "Montserrat-Regular" },
  dividerWrap: { marginVertical: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", },
  divider: { flex: 1, height: 1, backgroundColor: "#E6E6E6" },
});
```


## Referências

- React Native
- React Navigation
- Reanimated + Worklets
- Lottie React Native
- Lucide React Native
- React Native SVG
