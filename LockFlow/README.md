# LockFlow: Desbloqueio por Padrão (3×3) no React Native — do gesto ao fluxo completo

Crie uma tela de bloqueio estilo Android com padrão 3×3: arraste e conecte pontos, receba feedback visual, anime o sucesso e navegue para o dashboard. Este guia mostra a arquitetura, as regras do padrão (incluindo pontos intermediários) e como desenhar tudo com SVG de forma performática.

## Sumário

- [Demo](#demo)
- [Pré‑requisitos](#pré‑requisitos)
- [Instalação e configuração](#instalação-e-configuração)
  - [Dependências](#dependências)
  - [iOS (CocoaPods)](#ios-cocoapods)
- [Arquitetura do lock](#arquitetura-do-lock)
- [Implementação passo a passo](#implementação-passo-a-passo)
  - [Navegação e fluxo](#1-navegação-e-fluxo)
  - [Grid 3×3 e regras do padrão](#2-grid-3×3-e-regras-do-padrão)
  - [Arrasto com PanResponder](#3-arrasto-com-panresponder)
  - [Desenho com SVG (Polyline e Circles)](#4-desenho-com-svg-polyline-e-circles)
  - [Feedback visual e animações](#5-feedback-visual-e-animações)
  - [Callbacks e navegação](#6-callbacks-e-navegação)
  - [Parametrização e estilos](#7-parametrização-e-estilos)
- [Como executar](#como-executar)
- [Estrutura de pastas (referência)](#estrutura-de-pastas-referência)
- [Solução de problemas](#solução-de-problemas)
- [Referências](#referências)

## Demo



## Pré‑requisitos

- Node 20+, Java 17 (Android), Xcode + CocoaPods (iOS), Watchman (macOS)
- React Native CLI 0.82

## Instalação e configuração

### Dependências

No diretório do app, instale as dependências (já listadas em `package.json`):

```bash
npm install
```

Principais libs usadas:
- `@react-navigation/native` e `@react-navigation/native-stack`
- `react-native-screens` e `react-native-safe-area-context`
- `react-native-svg` (desenho do padrão)

### iOS (CocoaPods)

```bash
cd ios && pod install && cd ..
```

> Não há configuração especial de Babel aqui; o projeto usa `Animated` do React Native e `PanResponder` sem plugins adicionais.

## Arquitetura do lock

O fluxo é movido por gestos (Pan) e desenho com SVG:
- Grid 3×3 com centros pré‑computados.
- Seleção por proximidade durante o arrasto (raio de acerto para suavizar a UX).
- Regras: permite adjacentes e “saltos” de 2 casas, inserindo o ponto intermediário automaticamente quando aplicável (ex.: 0→2 insere 1).
- `Polyline` desenha o caminho em tempo real; cada ponto ativa um anel com animação.
- Estados de status: `idle`, `ok`, `fail` mudam a cor do traço e disparam feedback (vibração/anim.
- Ao sucesso, roda uma sequência de escala/opacidade e então navega para o `Dashboard`.

## Implementação passo a passo

Abaixo, os arquivos principais com trechos relevantes.

### 1) Navegação e fluxo

Arquivo: `App.tsx`

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar } from 'react-native';
import { PatternUnlockScreen } from './src/PatternUnlockScreen';
import { DashboardScreen } from './src/DashboardScreen.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Lock" component={LockWrapper} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LockWrapper({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D80FF' }}>
      <PatternUnlockScreen
        registeredPattern={[6, 3, 0, 4, 2, 5, 8]}
        onSuccess={() => navigation.replace('Dashboard')}
      />
    </SafeAreaView>
  );
}
```

### 2) Grid 3×3 e regras do padrão

Arquivo: `src/PatternUnlockScreen.tsx`

- Centros são calculados com base em `BOX_SIZE` e `PADDING`.
- Aceita adjacentes e saltos de duas casas (reta/diagonal), inserindo o ponto intermediário.

Trecho que injeta o ponto intermediário num salto:

```ts
function intermediateIndex(a: number, b: number): number | null {
  const A = idxToRC(a), B = idxToRC(b);
  const dr = B.r - A.r, dc = B.c - A.c;
  const isStraightTwo =
    (A.r === B.r && Math.abs(dc) === 2) ||
    (A.c === B.c && Math.abs(dr) === 2) ||
    (Math.abs(dr) === 2 && Math.abs(dc) === 2);
  if (!isStraightTwo) return null;
  const mid = { r: (A.r + B.r) / 2, c: (A.c + B.c) / 2 };
  return (Number.isInteger(mid.r) && Number.isInteger(mid.c)) ? (mid.r * 3 + mid.c) : null;
}
```

### 3) Arrasto com PanResponder

- `PanResponder` controla início/movimento/fim do gesto.
- Atualiza um ponto “vivo” para o cursor e realiza o snap para o ponto mais próximo dentro do raio.

```ts
const pan = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      reset();
      const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
      livePoint.current = p;
      const firstIdx = nearestIndexAny(p, centers);
      pathRef.current = [firstIdx];
      _setSelected([firstIdx]);
    },
    onPanResponderMove: (e) => {
      const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
      livePoint.current = p;
      setSelectedSync(prev => { /* seleciona novos pontos respeitando regras */ return prev; });
    },
    onPanResponderRelease: () => finish(),
  })
).current;
```

### 4) Desenho com SVG (Polyline e Circles)

- `Polyline` traça o caminho com cor que muda por status.
- Cada dot tem círculo com anel e preenchimento animado.

```tsx
<Svg width={BOX_SIZE} height={BOX_SIZE}>
  {linePoints.length > 1 && (
    <Polyline
      points={linePoints.map(p => `${p.x},${p.y}`).join(' ')}
      fill="none"
      stroke={strokeColor}
      strokeWidth={4}
    />
  )}
  {GRID_INDEXES.map((i) => (
    <>
      <AnimatedCircle cx={c.x} cy={c.y} r={rAnimated} fill="#FFF" fillOpacity={fillOpacity} />
      <Circle cx={c.x} cy={c.y} r={DOT_R} stroke="white" strokeWidth={3} fill="transparent" />
    </>
  ))}
</Svg>
```

### 5) Feedback visual e animações

- Pontos “pulso” ao serem ativados (`Animated.spring`).
- Sucesso toca uma sequência e então navega:

```ts
Animated.sequence([
  Animated.parallel([
    Animated.timing(frameScale, { toValue: 1.08, duration: 140, useNativeDriver: true }),
    Animated.timing(haloScale,  { toValue: 1.15, duration: 140, useNativeDriver: true }),
  ]),
  Animated.parallel([
    Animated.timing(frameScale, { toValue: 0.82, duration: 260, useNativeDriver: true }),
    Animated.timing(frameOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
    Animated.timing(haloScale,  { toValue: 1.6, duration: 260, useNativeDriver: true }),
  ]),
]).start(() => onSuccess?.());
```

### 6) Callbacks e navegação

- `registeredPattern`: array de índices esperados (0–8).
- `onSuccess`: chamado após animação de sucesso (no exemplo, `navigation.replace('Dashboard')`).
- `onFail`: vibração e reset após um breve atraso.

```tsx
<PatternUnlockScreen
  registeredPattern={[6, 3, 0, 4, 2, 5, 8]}
  onSuccess={() => navigation.replace('Dashboard')}
  onFail={() => {}}
  showDebug={false}
/>
```

### 7) Parametrização e estilos

- Ajuste `BOX_SIZE`, `PADDING`, `DOT_R` para tamanhos.
- Cores do fundo/frame estão em `styles` da tela; altere a paleta azul para o tema do app.
- `MOVE_HIT_R` suaviza a seleção durante o arrasto (UX mais tolerante).
- Para acessibilidade: considere sons/háptica extra e contraste de cores.

## Como executar

```bash
npm install
cd ios && pod install && cd ..
npm run start
npm run ios      # ou
npm run android
```

## Estrutura de pastas (referência)

```
LockFlow/
  App.tsx
  index.js
  babel.config.js
  metro.config.js
  package.json
  src/
    PatternUnlockScreen.tsx
    DashboardScreen.tsx
```

## Solução de problemas

- iOS/Pods: sempre rode `pod install` após instalar/atualizar libs nativas (`react-native-svg`).
- SVG não desenha ou erro de link: limpe o build (Xcode/Gradle) e reinstale pods.
- Gesto não responde: confira `hitSlop`, `pointerEvents="box-only"` no wrapper do `Svg` e se nenhum outro componente está capturando o toque.
- Metro/Cache: se erros estranhos surgirem, rode:

```bash
npm start -- --reset-cache
```

- Android: confirme Java 17 e SDKs instalados.

## Referências

- React Native: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- react-native-svg: https://github.com/software-mansion/react-native-svg
