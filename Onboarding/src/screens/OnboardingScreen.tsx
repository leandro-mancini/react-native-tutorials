import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import LottieView from 'lottie-react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

type SlideItemProps = {
  item: Slide;
  index: number;
  x: SharedValue<number>;
  width: number;
};

// 2) componente que pode usar hooks normalmente
const SlideItem = React.memo(({ item, index, x, width }: SlideItemProps) => {
  const rel = useDerivedValue(() => (index * width - x.value) / width, [index]);

  const TITLE_DIST = 70;   // deslocamento X do título
  const SUB_DIST   = 70;   // deslocamento X do subtítulo
  const STEP_DELAY = 0.5; // atraso fracionado (0..1)

  const titleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;                          // -1..0..1
    const dir = r > 0 ? 1 : (r < 0 ? -1 : 0);     // de onde o slide entra
    // exposição 0..1 (1 quando o slide está central)
    let exposure = 1 - Math.abs(r);
    if (exposure < 0) exposure = 0;
    if (exposure > 1) exposure = 1;

    // curva (ease-out simples)
    const e = exposure * exposure;

    // delay condicional: se entra pela ESQUERDA (dir<0), title atrasa
    let eTitle = e;
    if (dir < 0) {
      eTitle = (e - STEP_DELAY) / (1 - STEP_DELAY);
      if (eTitle < 0) eTitle = 0;
      if (eTitle > 1) eTitle = 1;
    }

    const tx = dir * (1 - eTitle) * TITLE_DIST;
    // const op = interpolate(eTitle, [0, 0.2, 1], [0, 0.9, 1], Extrapolation.CLAMP);

    return { transform: [{ translateX: tx }] };
  });

  const subtitleStyleAnim = useAnimatedStyle(() => {
    const r = rel.value;
    const dir = r > 0 ? 1 : (r < 0 ? -1 : 0);

    let exposure = 1 - Math.abs(r);
    if (exposure < 0) exposure = 0;
    if (exposure > 1) exposure = 1;

    const e = exposure * exposure;

    // delay condicional: se entra pela DIREITA (dir>0), subtitle atrasa
    let eSub = e;
    if (dir > 0) {
      eSub = (e - STEP_DELAY) / (1 - STEP_DELAY);
      if (eSub < 0) eSub = 0;
      if (eSub > 1) eSub = 1;
    }

    const tx = dir * (1 - eSub) * SUB_DIST;
    // const op = interpolate(eSub, [0, 0.15, 1], [0, 0.9, 1], Extrapolation.CLAMP);

    return { transform: [{ translateX: tx }] };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.illustrationBox, item.lottieBoxStyle]}>
        <LottieView
          source={item.lottie}
          autoPlay
          loop
          style={[{ width: 800, height: 800, alignSelf: 'center' }, item.lottieStyle]}
        />
      </View>
      <View style={styles.header}>
        <AnimatedText style={[styles.title, titleStyleAnim]}>{item.title}</AnimatedText>
        <AnimatedText style={[styles.subtitle, subtitleStyleAnim]}>{item.subtitle}</AnimatedText>
      </View>
    </View>
  );
});

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  bg: string;
  lottie: any;
  lottieStyle?: StyleProp<ViewStyle>;
  lottieBoxStyle?: StyleProp<ViewStyle>;
};

const SLIDES: Slide[] = [
  {
    key: 'a',
    title: "Expresse sua criatividade",
    subtitle: 'Expresse sua criatividade usando nosso aplicativo e usando nossos serviços premium',
    bg: '#EA94FF',
    lottie: require('../../assets/lottie/step1.json'),
  },
  {
    key: 'b',
    title: 'Compre com facilidade',
    subtitle: 'Nossa interface de usuário do aplicativo tornará sua experiência de compra tranquila e sem anúncios.',
    bg: '#B795FF',
    lottie: require('../../assets/lottie/step1.json'),
  },
  {
    key: 'c',
    title: "Comunique-se com facilidade",
    subtitle: 'Comunique-se usando nosso aplicativo para entrar em contato com outras pessoas em todo o mundo.',
    bg: '#FFBBBB',
    lottie: require('../../assets/lottie/step1.json'),
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const pagerRef = useAnimatedRef<Animated.FlatList<any>>();
  const x = useSharedValue(0);
  const ILLUSTRATION_H = Math.min(height * 0.48, 420);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  const bgStyle = useAnimatedStyle(() => {
    // índice fracionário do slide atual
    const i = x.value / width;

    const colors = SLIDES.map((s) => s.bg);
    // mapeia uma faixa [0..n-1] -> cores do array
    return {
      backgroundColor: interpolateColor(
        i,
        SLIDES.map((_, idx) => idx),
        colors
      ),
    };
  });

  const renderItem = ({ item, index }: { item: Slide; index: number }) => (
    <SlideItem item={item} index={index} x={x} width={width} />
  );

  const keyExtractor = (s: Slide) => s.key;

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Pager */}
        <Animated.FlatList
            ref={pagerRef}
            data={SLIDES}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
        />

        {/* Dots + CTA */}
        <Footer x={x} pagerRef={pagerRef} onFinish={() => {/* navegar para Home */}} />
      </SafeAreaView>
    </Animated.View>
  );
}

function Footer({
  x,
  pagerRef,
  onFinish,
}: {
  x: SharedValue<number>;
  pagerRef: React.RefObject<any>;
  onFinish?: () => void;
}) {
  const getIndex = () => Math.round(x.value / width);

  const handleNext = () => {
    const i = getIndex();
    if (i < SLIDES.length - 1) {
      pagerRef.current?.scrollToIndex?.({ index: i + 1, animated: true });
    } else {
      onFinish?.();
    }
  };

  return (
    <View style={styles.footerRow}>
      <View style={styles.footerLeft}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} x={x} />
          ))}
        </View>
      </View>

      <NextIconButton onPress={handleNext} progressX={x} total={SLIDES.length} />
    </View>
  );
}

function NextIconButton({
  onPress,
  progressX,
  total,
}: {
  onPress: () => void;
  progressX: SharedValue<number>;
  total: number;
}) {
  const size = 62;                // diâmetro do botão
  const strokeW = 3.5;
  const r = (size - strokeW) / 2; // raio do círculo de progresso
  const C = 2 * Math.PI * r;      // circunferência
  const pages = Math.max(1, total - 1); // evita divisão por zero

  // progresso global 0..1 baseado no scroll
  const animatedProps = useAnimatedProps(() => {
    const p = Math.min(Math.max(progressX.value / (width * pages), 0), 1);
    // dashoffset menor => mais preenchido
    return { strokeDashoffset: C * (1 - p) };
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconBtn}>
        {/* track */}
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={strokeW}
            fill="none"
          />
          {/* progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#FFF"
            strokeWidth={strokeW}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            animatedProps={animatedProps}
          />
        </Svg>

        {/* “miolo” branco + seta */}
        <View style={styles.iconInner}>
          <ChevronRight />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Dot({ index, x }: { index: number; x: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const position = x.value / width;

    const w = interpolate(
      position,
      [index - 1, index, index + 1],
      [8, 22, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      position,
      [index - 1, index, index + 1],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      position,
      [index - 1, index, index + 1],
      [1, 1.1, 1],
      Extrapolation.CLAMP
    );

    return { width: w, opacity, transform: [{ scale }] };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    height: 48,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    paddingTop: 0,
    paddingHorizontal: 24,
    gap: 0,
  },
  title: {
    fontSize: 40,
    color: '#000',
    fontFamily: 'Poppins-ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#3C3C3C',
    fontFamily: 'Poppins-Medium',
  },
  illustrationBox: {
    flex: 1,
    // overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerRow: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    alignItems: 'flex-start',
  },
  dotsRow: {
    height: 22,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  skip: { fontSize: 16, opacity: 0.8, color: '#fff' },
  cta: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  dot: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    width: 8, // largura base; anima no Dot()
  },

  // botão circular com anéis
  iconRing: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  iconRing2: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  iconBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: -2,
  },
});