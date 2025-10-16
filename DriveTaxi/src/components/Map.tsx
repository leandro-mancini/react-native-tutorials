import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export function Map() {
  const handleReady = () => console.log("[Map] onMapReady");

  return (
    <View style={styles.container}>
      <MapView
        testID="map-view"
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onMapReady={handleReady}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});