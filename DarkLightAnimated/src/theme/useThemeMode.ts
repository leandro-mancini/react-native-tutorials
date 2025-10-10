import { useCallback, useMemo, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export type ThemeMode = 'light' | 'dark';

/**
 * Mantém o estado "light" | "dark" e um sharedValue (0..1) que
 * usamos para interpolar cores, posições e progresso do Lottie.
 */
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