import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Vibration,
  Platform,
  GestureResponderEvent,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

// Animated version do Circle para animar raio e opacidade do fill
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  registeredPattern: number[];
  onSuccess?: () => void;
  onFail?: () => void;
  showDebug?: boolean;
};

type Point = { x: number; y: number };

const GRID_INDEXES = [...Array(9).keys()];
const BOX_SIZE = 300;
const PADDING = 48;

const DOT_R = 12;
const MOVE_HIT_R = 24;     // arrasto (estrito)

function safeVibrate(ms = 60) {
  try { if (Platform.OS === 'android' || Platform.OS === 'ios') Vibration.vibrate(ms); } catch {}
}

function idxToRC(i: number) { return { r: Math.floor(i / 3), c: i % 3 }; }

function isAdjacentOrTwoSteps(a: number, b: number) {
  const A = idxToRC(a), B = idxToRC(b);
  const dr = Math.abs(B.r - A.r);
  const dc = Math.abs(B.c - A.c);
  return (
    (dr <= 1 && dc <= 1 && (dr + dc) > 0) ||
    (dr === 2 && dc === 0) || (dr === 0 && dc === 2) || (dr === 2 && dc === 2)
  );
}

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

function nearestIndexAny(p: Point, centers: Point[]) {
  let idx = 0, best = Number.MAX_VALUE;
  centers.forEach((c, i) => {
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    if (d < best) { best = d; idx = i; }
  });
  return idx;
}
function nearestIndexWithin(p: Point, centers: Point[], radius: number): number | null {
  let idx: number | null = null, best = Number.MAX_VALUE;
  centers.forEach((c, i) => {
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    if (d < best) { best = d; idx = i; }
  });
  return best <= radius ? idx : null;
}

// Constrói a string de pontos do polyline a partir dos índices e um ponto vivo opcional
function buildPointsString(indices: number[], centers: Point[], tail?: Point) {
  const base = indices.map(i => `${centers[i].x},${centers[i].y}`).join(' ');
  return tail ? (base ? `${base} ${tail.x},${tail.y}` : `${tail.x},${tail.y}`) : base;
}

export function PatternUnlockScreen({
  registeredPattern,
  onSuccess,
  onFail,
  showDebug = false,
}: Props) {
  const [selected, _setSelected] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);
  const [status, setStatus] = useState<'idle'|'ok'|'fail'>('idle');

  // --- Animações (sucesso) ---
  const frameScale = useRef(new Animated.Value(1)).current;
  const frameOpacity = useRef(new Animated.Value(1)).current;
  const haloScale = useRef(new Animated.Value(1)).current;

  // --- Posição viva do cursor (para o Polyline) com update via rAF ---
  const [livePointState, setLivePointState] = useState<Point | null>(null);
  const rafRef = useRef<number | null>(null);
  const scheduleCursorUpdate = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setLivePointState(livePoint.current);
    });
  };

  // --- Animações por ponto (ativação do círculo) ---
  const dotProgress = useRef([...Array(9)].map(() => new Animated.Value(0))).current;
  const prevSelectedRef = useRef<number[]>([]);
  const polyRef = useRef<any>(null);

  // sync helpers
  const setSelectedSync = (next: number[] | ((prev: number[]) => number[])) => {
    _setSelected(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      pathRef.current = value;
      return value;
    });
  };

  // centros dos 9 pontos
  const centers = useMemo<Point[]>(() => {
    const area = BOX_SIZE - PADDING * 2;
    const step = area / 2;
    const base = PADDING;
    const pts: Point[] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
      pts.push({ x: base + c * step, y: base + r * step });
    return pts;
  }, []);

  const livePoint = useRef<Point | null>(null);

  const linePoints: Point[] = [
    ...selected.map(i => centers[i]),
    ...(livePointState ? [livePointState] : []),
  ];

  // Mantém o polyline sincronizado quando selected muda
  useEffect(() => {
    if (polyRef.current) {
      const pts = buildPointsString(pathRef.current, centers, livePoint.current || undefined);
      polyRef.current.setNativeProps({ points: pts });
    }
  }, [selected, centers]);

  function reset() {
    // cancelar rAF pendente
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    pathRef.current = [];
    _setSelected([]);
    setStatus('idle');
    livePoint.current = null;
    setLivePointState(null);
    frameScale.setValue(1);
    frameOpacity.setValue(1);
    haloScale.setValue(1);
    // reset animação dos pontos
    dotProgress.forEach(v => v.setValue(0));
    prevSelectedRef.current = [];
    // zera o polyline
    if (polyRef.current) {
      polyRef.current.setNativeProps({ points: '' });
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Dispara animação quando um novo ponto é selecionado
  useEffect(() => {
    const prev = prevSelectedRef.current;
    const newly = selected.filter(i => !prev.includes(i));
    newly.forEach(i => {
      dotProgress[i].stopAnimation?.();
      dotProgress[i].setValue(0);
      Animated.spring(dotProgress[i], {
        toValue: 1,
        stiffness: 260,
        damping: 22,
        mass: 0.5,
        useNativeDriver: false, // animando props SVG numéricas
      }).start();
    });
    prevSelectedRef.current = selected;
  }, [selected, dotProgress]);

  function commitFinalPoint() {
    const lp = livePoint.current;
    if (!lp) return;
    const last = pathRef.current[pathRef.current.length - 1];
    let idx = nearestIndexWithin(lp, centers, MOVE_HIT_R);
    if (idx == null) idx = nearestIndexAny(lp, centers);
    if (idx == null || pathRef.current.includes(idx)) return;
    if (!isAdjacentOrTwoSteps(last, idx)) return;

    const next = [...pathRef.current];
    const mid = intermediateIndex(last, idx);
    if (mid != null && !next.includes(mid)) next.push(mid);
    next.push(idx);

    pathRef.current = next;
    _setSelected(next);
  }

  // toca animação de sucesso e só depois chama onSuccess
  function playSuccessAndNavigate() {
    setStatus('ok');

    Animated.sequence([
      Animated.parallel([
        Animated.timing(frameScale, { toValue: 1.08, duration: 140, useNativeDriver: true }),
        Animated.timing(haloScale,  { toValue: 1.15, duration: 140, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(frameScale, {
          toValue: 0.82,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(frameOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(haloScale,    { toValue: 1.6, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) {
        onSuccess?.();
        // não resetamos aqui para não “piscAR” ao trocar de tela
      }
    });
  }

  function finish() {
    commitFinalPoint();
    const captured = pathRef.current;
    const ok =
      captured.length === registeredPattern.length &&
      captured.every((v, i) => v === registeredPattern[i]);

    if (ok) {
      playSuccessAndNavigate();
    } else {
      setStatus('fail');
      safeVibrate(60);
      onFail?.();
      // feedback visual breve e reset
      setTimeout(reset, 600);
    }
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        reset();
        const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        livePoint.current = p;
        setLivePointState(p);
        const firstIdx = nearestIndexAny(p, centers); // snap inicial
        pathRef.current = [firstIdx];
        _setSelected([firstIdx]);
        // atualiza polyline imediatamente
        if (polyRef.current) {
          const pts = buildPointsString(pathRef.current, centers, p);
          polyRef.current.setNativeProps({ points: pts });
        }
      },

      onPanResponderMove: (e: GestureResponderEvent) => {
        const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        livePoint.current = p;
        scheduleCursorUpdate();

        // atualiza polyline para seguir o cursor com mais precisão
        if (polyRef.current) {
          const pts = buildPointsString(pathRef.current, centers, p);
          polyRef.current.setNativeProps({ points: pts });
        }

        setSelectedSync(prev => {
          const last = prev[prev.length - 1];
          const idx = nearestIndexWithin(p, centers, MOVE_HIT_R);
          if (idx == null || prev.includes(idx)) return prev;
          if (!isAdjacentOrTwoSteps(last, idx)) return prev;

          const next = [...prev];
          const mid = intermediateIndex(last, idx);
          if (mid != null && !next.includes(mid)) next.push(mid);
          next.push(idx);

          // quando seleciona novo ponto, atualiza polyline com base atualizada
          if (polyRef.current) {
            const pts = buildPointsString(next, centers, p);
            polyRef.current.setNativeProps({ points: pts });
          }
          return next;
        });
      },

      onPanResponderRelease: () => finish(),
      onPanResponderTerminate: () => finish(),
    })
  ).current;

  const strokeColor =
    status === 'ok' ? '#22C55E' :
    status === 'fail' ? '#EF4444' :
    'rgba(255,255,255,0.95)';

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.backHalo,
          { transform: [{ scale: haloScale }] }
        ]}
      />
      <Animated.View
        style={[
          styles.phoneFrame,
          { transform: [{ scale: frameScale }], opacity: frameOpacity }
        ]}
      >
        {/* <Text style={styles.title}>Enter password</Text> */}

        <View
          pointerEvents="box-only"
          collapsable={false}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ width: BOX_SIZE, height: BOX_SIZE, alignSelf: 'center' }}
          {...pan.panHandlers}
        >
          <Svg width={BOX_SIZE} height={BOX_SIZE}>
            {linePoints.length > 1 && (
              <Polyline
                ref={polyRef}
                points={linePoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={strokeColor}
                strokeOpacity={0.9}
                strokeWidth={4}
                strokeLinejoin="miter"
                strokeLinecap="butt"
              />
            )}
            {GRID_INDEXES.map((i) => {
              const c = centers[i];
              // Interpola raio e opacidade do preenchimento conforme ativação
              const rAnimated = dotProgress[i].interpolate({
                inputRange: [0, 1],
                outputRange: [DOT_R, DOT_R * 1.6],
              });
              const fillOpacity = dotProgress[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.22],
              });
              return (
                <React.Fragment key={i}>
                  {/* Círculo preenchido e com scale animado */}
                  <AnimatedCircle
                    cx={c.x}
                    cy={c.y}
                    r={rAnimated as any}
                    fill="#FFFFFF"
                    fillOpacity={fillOpacity as any}
                  />
                  {/* Anel estático por cima */}
                  <Circle
                    cx={c.x}
                    cy={c.y}
                    r={DOT_R}
                    stroke="white"
                    strokeOpacity={0.95}
                    strokeWidth={3}
                    fill="transparent"
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        </View>

        {showDebug && (
          <Text style={styles.debug}>captured: [{selected.join(', ')}]</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D80FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHalo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  phoneFrame: {
    width: 340,
    borderRadius: 32,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#108CFF',
    alignItems: 'center',
  },
  title: {
    color: '#EAF2FF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
  },
  footer: {
    marginTop: 18,
    width: '84%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    color: 'white',
    opacity: 0.9,
    fontSize: 16,
    fontWeight: '500',
  },
  debug: {
    marginTop: 8,
    color: '#EAF2FF',
    opacity: 0.8,
    fontSize: 12,
  },
});
