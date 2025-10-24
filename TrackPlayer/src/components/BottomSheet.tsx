import React, { useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Animated, Easing } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number; // default 60% height
  rounded?: boolean;
};

export default function BottomSheet({ visible, onClose, children, snapHeight = 0.6, rounded = true }: Props) {
  const translateY = useRef(new Animated.Value(1)).current; // 1 => hidden, 0 => shown
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 1, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  const heightPct = Math.max(0.3, Math.min(0.95, snapHeight));
  const translate = translateY.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          rounded && styles.rounded,
          { height: `${heightPct * 100}%`, transform: [{ translateY: Animated.multiply(translate, heightPct) }] },
        ]}
      >
        <View style={styles.handleBar} />
        {children}
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
    paddingBottom: 24,
  },
  rounded: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handleBar: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#3a3a3a",
    marginTop: 10,
    marginBottom: 8,
  },
});
