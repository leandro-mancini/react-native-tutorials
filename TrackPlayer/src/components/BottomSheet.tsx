import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Modal, Pressable, StyleSheet, View, PanResponder, Easing } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialSnap?: number; // 0..1 (default 0.9)
  snapPoints?: number[]; // e.g., [0.6, 1]
};

export default function AppBottomSheet({ visible, onClose, children, initialSnap = 0.9, snapPoints = [0.6, 1] }: Props) {
  const screenH = Dimensions.get("window").height;
  const points = useMemo(() => {
    const clamped = snapPoints
      .map((p) => Math.max(0.3, Math.min(1, p)))
      .sort((a, b) => a - b);
    return Array.from(new Set(clamped)).map((p) => Math.round(screenH * p));
  }, [snapPoints, screenH]);

  const openH = useMemo(() => Math.round(screenH * Math.max(0.3, Math.min(1, initialSnap))), [initialSnap, screenH]);
  const height = useRef(new Animated.Value(0)).current; // 0 closed .. screenH full
  const backdrop = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(height, { toValue: 450, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(backdrop, { toValue: Math.min(1, openH / screenH), duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(height, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: false }),
        Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, openH, height, backdrop, screenH]);

  const closeWithAnim = () => {
    Animated.parallel([
      Animated.timing(height, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: false }),
      Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  const currentHRef = useRef(0);
  const startHRef = useRef(0);
  height.addListener(({ value }) => {
    currentHRef.current = value;
  });
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        startHRef.current = currentHRef.current || openH;
      },
      onPanResponderMove: (_, g) => {
        // Drag para cima (dy negativo) aumenta a altura; para baixo diminui
        const next = Math.max(0, Math.min(screenH, startHRef.current - g.dy));
        height.setValue(next);
        backdrop.setValue(Math.min(1, next / screenH));
      },
      onPanResponderRelease: (_, g) => {
        const h = currentHRef.current;
        const closeThreshold = screenH * 0.2;
        const isClosing = (g.vy > 1 && h < openH) || h < closeThreshold;
        if (isClosing) {
          closeWithAnim();
          return;
        }

        // Snap para o ponto mais próximo
        const target = points.reduce((prev, curr) => (Math.abs(curr - h) < Math.abs(prev - h) ? curr : prev), points[0]);
        Animated.spring(height, { toValue: target, useNativeDriver: false, bounciness: 0, damping: 18, stiffness: 180 }).start();
        Animated.timing(backdrop, { toValue: Math.min(1, target / screenH), duration: 120, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(height, { toValue: openH, useNativeDriver: false, bounciness: 6 }).start();
      },
    })
  ).current;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeWithAnim}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}> 
        <Pressable style={StyleSheet.absoluteFill} onPress={closeWithAnim} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { height }]}
        {...pan.panHandlers}
      >
        <View style={styles.handleBar} />
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#181818",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  handleBar: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#3a3a3a",
    marginTop: 10,
    marginBottom: 8,
  },
  content: { paddingBottom: 24 },
});
