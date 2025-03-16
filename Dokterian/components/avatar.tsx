import { Image, StyleSheet, Text, View } from "react-native";

interface AvatarProps {
    source?: string;
    initials?: string;
    size?: number;
    backgroundColor?: string;
}

export const Avatar = ({ size = 50, backgroundColor, source, initials }: AvatarProps) => {
    return (
        <View
          style={[
            styles.container,
            { width: size, height: size, borderRadius: size / 2, backgroundColor },
          ]}
        >
          {source ? (
            <Image
              source={{ uri: source }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ) : (
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
              {initials}
            </Text>
          )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    initials: {
      color: "#fff",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
});