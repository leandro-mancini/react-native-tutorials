import LottieView from "lottie-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.overlay}>
      <View style={styles.coffee}>
        <LottieView
          source={require("./assets/smoke.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Image source={require("./assets/images/Coffee.png")} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Comece o dia com {'\n'}um café e código!</Text>
        <Text style={styles.description}>Inspire-se com um café quente e {'\n'}transforme ideias em código.</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'space-between' },
  coffee: {
    backgroundColor: '#272221',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
    position: 'relative'
  },
  lottie: { width: 200, height: 200, marginBottom: -50 },
  image: { width: 250, height: 250, marginBottom: -50 },
  content: { backgroundColor: '#FAFAFA', paddingBlock: 32, paddingInline: 24, borderRadius: 20 },
  title: { textAlign: 'center', fontFamily: 'Roboto', fontWeight: 'bold', color: '#272221', fontSize: 24 },
  description: { textAlign: 'center', color: '#333', paddingBottom: 24 },
  button: { backgroundColor: '#4B2995', width: '100%', borderRadius: 6 },
  buttonText: { textTransform: 'uppercase', textAlign: 'center', color: '#FFF', fontWeight: 'bold', paddingBlock: 16 },
});
