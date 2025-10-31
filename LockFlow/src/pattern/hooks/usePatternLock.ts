import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, PanResponder } from 'react-native';
import {
  BOX_SIZE,
  MOVE_HIT_R,
  centersForGrid,
  intermediateIndex,
  isAdjacentOrTwoSteps,
  nearestIndexAny,
  nearestIndexWithin,
} from '../utils/geometry';
import type { Point } from '../utils/geometry';
import { safeVibrate } from '../utils/feedback';

export type LockStatus = 'idle' | 'ok' | 'fail';

export type UsePatternLockParams = {
  registeredPattern: number[];
  onSuccess?: () => void;
  onFail?: () => void;
};

export function usePatternLock({ registeredPattern, onSuccess, onFail }: UsePatternLockParams) {
  const [selected, _setSelected] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);
  const [status, setStatus] = useState<LockStatus>('idle');

  // animações frame/halo para sucesso
  const frameScale = useRef(new Animated.Value(1)).current;
  const frameOpacity = useRef(new Animated.Value(1)).current;
  const haloScale = useRef(new Animated.Value(1)).current;

  // centers e cursor vivo
  const centers = useMemo(() => centersForGrid(), []);
  const [livePointState, setLivePointState] = useState<Point | null>(null);
  const livePoint = useRef<Point | null>(null);
  const rafRef = useRef<number | null>(null);

  const scheduleCursorUpdate = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setLivePointState(livePoint.current);
    });
  };

  useEffect(() => () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); }, []);

  // animação por dot
  const dotProgress = useRef([...Array(9)].map(() => new Animated.Value(0))).current;
  const prevSelectedRef = useRef<number[]>([]);

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
        useNativeDriver: false,
      }).start();
    });
    prevSelectedRef.current = selected;
  }, [selected, dotProgress]);

  const setSelectedSync = (next: number[] | ((prev: number[]) => number[])) => {
    _setSelected(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      pathRef.current = value;
      return value;
    });
  };

  function reset() {
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    pathRef.current = [];
    _setSelected([]);
    setStatus('idle');
    livePoint.current = null;
    setLivePointState(null);
    frameScale.setValue(1);
    frameOpacity.setValue(1);
    haloScale.setValue(1);
    dotProgress.forEach(v => v.setValue(0));
    prevSelectedRef.current = [];
  }

  function commitFinalPoint() {
    const lp = livePoint.current; if (!lp) return;
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
    ]).start(({ finished }) => { if (finished) onSuccess?.(); });
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
        livePoint.current = p; setLivePointState(p);
        const firstIdx = nearestIndexAny(p, centers);
        pathRef.current = [firstIdx];
        _setSelected([firstIdx]);
      },

      onPanResponderMove: (e: GestureResponderEvent) => {
        const p = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        livePoint.current = p; scheduleCursorUpdate();
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

  const linePoints: Point[] = [
    ...selected.map(i => centers[i]),
    ...(livePointState ? [livePointState] : []),
  ];

  return {
    // estado
    selected,
    status,
    linePoints,
    dotProgress,
    // dimensões
    BOX_SIZE,
    centers,
    // animações container
    frameScale,
    frameOpacity,
    haloScale,
    // gestos
    panHandlers: pan.panHandlers,
  };
}
