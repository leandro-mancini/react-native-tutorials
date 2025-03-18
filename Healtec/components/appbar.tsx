import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { Avatar } from "./avatar";
import { IconButton } from "./icon-button";
import { Icon } from "./icon";
import Ripple from "react-native-material-ripple";

interface AppBarProps {
  username: string;
  avatarUrl: string;
  onIconPress?: () => void;
}

export const AppBar = ({ username, avatarUrl, onIconPress }: AppBarProps) => {
  return (
    <ImageBackground
      source={require("../assets/images/background-appbar.png")}
      style={styles.background}
      resizeMode="cover"
    >
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.userInfo}>
                    <Avatar source={avatarUrl} size={48} backgroundColor="#4894FE" />
                    <View style={styles.userContent}>
                        <Text style={styles.hello}>Olá, bem-vindo 🎉</Text>
                        <Text style={styles.username}>{username}</Text>
                    </View>
                </View>
                <IconButton onPress={() => console.log("Clicado!")}>
                    <Icon name="NotificationBingIcon" size={24} color="white" />
                </IconButton>
            </View>

            <Ripple style={styles.searchContainer} rippleContainerBorderRadius={14}>
                <Icon name="SearchNormalIcon" size={24} color="rgba(237,237,252,0.40)" />
                <Text style={styles.searchText}>Pesquisar Doutor...</Text>
            </Ripple>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#4C4DDC",
    },
  container: {
    padding: 24,
    gap: 24
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  userContent: {
    gap: 4
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hello: {
    fontSize: 14,
    lineHeight: 16,
    color: "white",
    fontFamily: "Inter_24pt-Regular"
  },
  username: {
    fontSize: 20,
    lineHeight: 24,
    color: "white",
    fontFamily: "Inter_18pt-SemiBold"
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(237,237,252,0.20)",
    gap: 8
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Inter_24pt-Regular",
    color: "rgba(237,237,252,0.40)",
  },
});