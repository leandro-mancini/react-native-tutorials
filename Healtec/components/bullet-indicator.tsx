import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface BulletIndicatorProps {
  total: number;
  currentIndex: Animated.Value;
}

export const BulletIndicator = ({ total, currentIndex }: BulletIndicatorProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const dotWidth = currentIndex.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [8, 16, 8],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, { width: dotWidth, opacity: currentIndex.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp",
            }) }]} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4C4DDC",
    marginHorizontal: 2,
  },
});
