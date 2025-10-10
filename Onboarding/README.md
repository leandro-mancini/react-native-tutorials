# Tutorial passo a passo para criar a interface de onboarding animada (React Native)

Este guia mostra, passo a passo, como montar a interface do app Onboarding: instalar bibliotecas, configurar o projeto, criar os componentes base, montar os slides e ajustar as animações.

## Sumário

- [Pré‑requisitos](#pré‑requisitos)
- [Passo 1 — Instalar dependências](#passo-1--instalar-dependências)
- [Passo 2 — Configurar Babel e entrada do app](#passo-2--configurar-babel-e-entrada-do-app)
- [Passo 3 — Configurar Metro para SVG](#passo-3--configurar-metro-para-svg)
- [Passo 4 — Adicionar assets (SVG e fontes)](#passo-4--adicionar-assets-svg-e-fontes)
- [Passo 5 — Estruturar slides e componentes](#passo-5--estruturar-slides-e-componentes)
- [Como executar](#como-executar)
- [Solução de problemas](#solução-de-problemas)
- [Estrutura final de arquivos (referência)](#estrutura-final-de-arquivos-referência)
- [Códigos completos](#códigos-completos)
- [Referências](#referências)

## Demo



## Pré‑requisitos

- Node 20+, Java 17 (Android), Xcode + CocoaPods (iOS), Watchman (macOS)
- React Native CLI (ou use o projeto deste repositório)

## Passo 1 — Instalar dependências

No diretório do app:

```bash
npm i react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-svg \
  lucide-react-native react-native-linear-gradient \
  @react-native-community/blur react-native-worklets
```

iOS (CocoaPods):

```bash
cd ios && pod install && cd ..
```

Observação: este template usa SVGs como componentes (via `react-native-svg` + `react-native-svg-transformer`).

## Passo 2 — Configurar Babel e entrada do app

Arquivo `babel.config.js` (habilita Worklets/Reanimated):

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

Arquivo `index.js` (recomenda-se importar no topo):

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
```

No `App.tsx`, envolva com `GestureHandlerRootView` (já feito no projeto) e renderize a tela de onboarding.

## Passo 3 — Configurar Metro para SVG

Permite importar `.svg` como componentes React Native:

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Passo 4 — Adicionar assets (SVG e fontes)

- Coloque os SVGs em `assets/svg/` (ex.: `figure1-step1.svg`, `ball1.svg`, etc.).
- Adicione fontes em `assets/fonts/` (ex.: `Poppins-Medium.ttf`, `Poppins-ExtraBold.ttf`).
- Garanta o mapeamento em `react-native.config.js`:

```js
module.exports = { assets: ['./assets/fonts'] };
```

- Linkar assets (uma vez):

```bash
npx react-native-asset
```

## Passo 5 — Estruturar slides e componentes

A tela principal (`src/screens/OnboardingScreen.tsx`) usa:

- FlatList paginada com `pagingEnabled` + `react-native-reanimated` para interpolar cores e posições.
- Um conjunto de figuras/bolas SVG animadas com poses por etapa (arrays de `top/left/right/scale/rotate/fill`).
- Rodapé (`Footer`) com dots e botão “Próximo/Concluir”.

Definição dos slides em `src/constants/onboardingSlides.ts`:

```ts
import { Slide } from '../components/onboarding/types';
import { SlideHero, SlideLeftImage, SlideBottomBig } from '../components/onboarding/variants';

export const SLIDES: Slide[] = [
  {
    key: 'a',
    title: 'Expresse sua criatividade',
    subtitle: 'Expresse sua criatividade usando nosso aplicativo e usando nossos serviços premium',
    bg: '#EA94FF',
    render: SlideHero,
  },
  {
    key: 'b',
    title: 'Compre com facilidade',
    subtitle: 'Nossa interface de usuário do aplicativo tornará sua experiência de compra tranquila e sem anúncios.',
    bg: '#B795FF',
    render: SlideLeftImage,
  },
  {
    key: 'c',
    title: 'Comunique-se com facilidade',
    subtitle: 'Comunique-se usando nosso aplicativo para entrar em contato com outras pessoas em todo o mundo.',
    bg: '#FFBBBB',
    render: SlideBottomBig,
  },
];
```

Os componentes de slide ficam em `src/components/onboarding/` (`SlideItem`, `variants.tsx`, `Footer`, `Dot`, etc.).

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

- Reanimated/Worklets: confirme o plugin no `babel.config.js` e a importação em `index.js`.
- Metro/SVG: se “unable to resolve svg”, confira o `metro.config.js` e limpe o cache:

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
Onboarding/
  App.tsx
  index.js
  babel.config.js
  metro.config.js
  react-native.config.js
  assets/
    fonts/ (Poppins-Medium.ttf, Poppins-ExtraBold.ttf)
    svg/   (figure1-step1.svg, figure2-step1.svg, figure3-step1.svg, figure4-step3.svg, ball1.svg, ball2.svg, ball3.svg)
  src/
    screens/
      OnboardingScreen.tsx
    components/
      onboarding/
        Footer.tsx
        Dot.tsx
        NextIconButton.tsx
        SlideItem.tsx
        variants.tsx
      Step1.tsx
    constants/
      onboardingSlides.ts
    types/
```

## Códigos completos

### App.tsx

```tsx
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <OnboardingScreen />
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#000' } });
```

### index.js (entrada)

```js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### metro.config.js (SVG transformer)

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: { babelTransformerPath: require.resolve('react-native-svg-transformer') },
  resolver: { assetExts: assetExts.filter((ext) => ext !== 'svg'), sourceExts: [...sourceExts, 'svg'] },
};

module.exports = mergeConfig(defaultConfig, config);
```

### src/constants/onboardingSlides.ts (exemplo)

```ts
import { Slide } from '../components/onboarding/types';
import { SlideHero, SlideLeftImage, SlideBottomBig } from '../components/onboarding/variants';

export const SLIDES: Slide[] = [
  { key: 'a', title: 'Expresse sua criatividade', subtitle: '...', bg: '#EA94FF', render: SlideHero },
  { key: 'b', title: 'Compre com facilidade',     subtitle: '...', bg: '#B795FF', render: SlideLeftImage },
  { key: 'c', title: 'Comunique-se com facilidade', subtitle: '...', bg: '#FFBBBB', render: SlideBottomBig },
];
```

> Consulte o código completo das telas e componentes no diretório `src/` deste projeto.

## Referências

- React Native: https://reactnative.dev/
- Reanimated + Worklets: https://docs.swmansion.com/react-native-reanimated/
- React Native SVG: https://docs.expo.dev/versions/latest/sdk/svg/
- react-native-svg-transformer: https://github.com/kristerkari/react-native-svg-transformer
- react-native-gesture-handler: https://docs.swmansion.com/react-native-gesture-handler/
