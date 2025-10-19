import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Pressable,
  Vibration,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

type Props = {
  registeredPattern: number[];      // ex.: [3,4,7,8]
  onSuccess?: () => void;
  onFail?: () => void;
  showDebug?: boolean;
};

type Point = { x: number; y: number };

const GRID_INDEXES = [...Array(9).keys()]; // 0..8
const BOX_SIZE = 300;
const PADDING = 24;

const DOT_R = 12;
const FIRST_HIT_R = 48;  // 1º toque (snap amplo)
const MOVE_HIT_R  = 28;  // arrasto (mais estrito)

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

export function PatternUnlockScreen({
  registeredPattern,
  onSuccess,
  onFail,
  showDebug = false,
}: Props) {
  const [selected, _setSelected] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);         // <- fonte da verdade p/ validação
  const [status, setStatus] = useState<'idle'|'ok'|'fail'>('idle');

  // helpers para manter state e ref sempre em sincronia
  const setSelectedSync = (next: number[] | ((prev: number[]) => number[])) => {
    _setSelected(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      pathRef.current = value;
      return value;
    });
  };

  const pushIndex = (idx: number) => {
    setSelectedSync(prev => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  // centros dos 9 pontos
  const centers = useMemo<Point[]>(() => {
    const area = BOX_SIZE - PADDING * 2;
    const step = area / 2; // 3 pontos => 2 steps
    const base = PADDING;
    const pts: Point[] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) pts.push({ x: base + c * step, y: base + r * step });
    return pts;
  }, []);

  const livePoint = useRef<Point | null>(null);

  const linePoints: Point[] = [
    ...selected.map(i => centers[i]),
    ...(livePoint.current ? [livePoint.current] : []),
  ];

  function reset() {
    pathRef.current = [];
    _setSelected([]);
    setStatus('idle');
    livePoint.current = null;
  }

  // garante que o último ponto (onde o dedo/curso parou) entre antes de validar
  function commitFinalPoint() {
    const lp = livePoint.current;
    if (!lp) return;
    const last = pathRef.current[pathRef.current.length - 1];
    // tente pegar dentro do MOVE_HIT_R
    let idx = nearestIndexWithin(lp, centers, MOVE_HIT_R);
    if (idx == null) {
      // como fallback, se estiver muito colado, pegue o mais próximo
      idx = nearestIndexAny(lp, centers);
    }
    if (idx == null || pathRef.current.includes(idx)) return;

    // só aceita se adjacente/dois passos (com intermediário)
    if (!isAdjacentOrTwoSteps(last, idx)) return;

    const next = [...pathRef.current];
    const mid = intermediateIndex(last, idx);
    if (mid != null && !next.includes(mid)) next.push(mid);
    next.push(idx);

    pathRef.current = next;
    _setSelected(next);
  }

  function finish() {
    // garanta captura do último
    commitFinalPoint();

    const captured = pathRef.current;
    const ok =
      captured.length === registeredPattern.length &&
      captured.every((v, i) => v === registeredPattern[i]);

    if (ok) {
      setStatus('ok');
      onSuccess?.();
      setTimeout(reset, 600);
    } else {
      setStatus('fail');
      safeVibrate(60);
      onFail?.();
      setTimeout(reset, 700);
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

        const firstIdx = nearestIndexAny(p, centers); // snap inicial
        pathRef.current = [firstIdx];
        _setSelected([firstIdx]);
      },

      onPanResponderMove: (e: GestureResponderEvent) => {
        const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        livePoint.current = p;

        setSelectedSync(prev => {
          const last = prev[prev.length - 1];
          const idx = nearestIndexWithin(p, centers, MOVE_HIT_R);
          if (idx == null || prev.includes(idx)) return prev;

          if (!isAdjacentOrTwoSteps(last, idx)) return prev;

          const next = [...prev];
          const mid = intermediateIndex(last, idx);
          if (mid != null && !next.includes(mid)) next.push(mid);
          next.push(idx);
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
      <View style={styles.backHalo} />
      <View style={styles.phoneFrame}>
        <Text style={styles.title}>Enter password</Text>

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
                points={linePoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={strokeColor}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {GRID_INDEXES.map((i) => {
              const c = centers[i];
              const active = selected.includes(i);
              return (
                <Circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r={DOT_R}
                  stroke="white"
                  strokeOpacity={0.95}
                  strokeWidth={3}
                  fill={active ? 'rgba(255,255,255,0.18)' : 'transparent'}
                />
              );
            })}
          </Svg>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => { /* tela de emergência */ }}>
            <Text style={styles.footerBtn}>Emergency</Text>
          </Pressable>
          <Pressable onPress={reset}>
            <Text style={styles.footerBtn}>Cancel</Text>
          </Pressable>
        </View>

        {showDebug && (
          <Text style={styles.debug}>captured: [{selected.join(', ')}]</Text>
        )}
      </View>
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
    borderWidth: 10,
    borderColor: '#0A2A49',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
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
