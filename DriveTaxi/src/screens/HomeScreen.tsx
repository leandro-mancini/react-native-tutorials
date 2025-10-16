import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Map } from '../components/Map';
import {
  Menu,
  Navigation,
  Clock,
  ChevronDown,
  Coffee,
  Car,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useLocationPermission } from '../hooks/useLocationPermission';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ route, navigation }: Props) {
  const destination = route.params?.destination;
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | undefined>();
  const locPermission = useLocationPermission();

  return (
    <SafeAreaView style={styles.container}>
      {/* Mapa de fundo */}
      <View style={StyleSheet.absoluteFill}>
        <Map
          destination={destination?.location ? {
            latitude: destination.location.latitude,
            longitude: destination.location.longitude,
            title: destination.description,
          } : undefined}
          onRouteInfo={(info) => setRouteInfo(info ? { distanceText: info.distanceText, durationText: info.durationText } : undefined)}
        />
      </View>

      {/* Caso a permissão seja negada, mostramos um aviso simples */}
      {locPermission === 'denied' && (
        <View style={styles.permissionToast}>
          <Text style={styles.permissionText}>Ative a localização para ver carros por perto</Text>
        </View>
      )}

      {/* Gradiente para transição do mapa para a UI inferior */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.92)", "#FFFFFF"]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      {/* Botão de menu */}
      <View style={styles.header}>
        <Pressable style={styles.menuButton} onPress={() => {}}>
          <Menu color="#1C1C1C" size={22} />
        </Pressable>
      </View>

      {/* Área inferior com busca e cards */}
      <View style={styles.bottomPanel}>
        {/* Barra de busca */}
        <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <View style={styles.searchLeft}>
            <Navigation size={18} color="#1C1C1C" />
            <Text style={styles.searchText} numberOfLines={1}>
              {destination?.description ?? 'Where to?'}
            </Text>
          </View>
          <View style={styles.searchRight}>
            <Clock size={16} color="#6B6B6B" />
            <Text style={styles.searchWhen}>Now</Text>
            <ChevronDown size={16} color="#6B6B6B" />
          </View>
        </Pressable>

        {/* Info da rota, quando houver */}
        {routeInfo && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeInfoText}>{routeInfo.durationText} • {routeInfo.distanceText}</Text>
          </View>
        )}

        {/* Cards de destino */}
        <View style={styles.cardsRow}>
          <Pressable style={[styles.card, styles.cardPrimary]} onPress={() => {}}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardPrimaryTitle}>Angelina{"\n"}Paris Cafe</Text>
              <Text style={styles.cardPrimaryTime}>13 min</Text>
            </View>
            <Coffee color="#B58200" size={44} />
          </Pressable>

          <Pressable style={[styles.card, styles.cardSecondary]} onPress={() => {}}>
            <Text style={styles.cardSecondaryTitle}>UGC Cine{"\n"}Cite Halles</Text>
            <Text style={styles.cardSecondaryTime}>20 min</Text>
            <View style={styles.cardSecondaryIconWrap}>
              <Car color="#F0C53D" size={30} />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  header: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // sombra
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bottomPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  searchBar: {
    height: 64,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9E9E9',
  },
  searchLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchText: {
    color: '#1C1C1C',
    fontSize: 20,
    fontFamily: 'Montserrat-Medium',
  },
  searchRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  searchWhen: { color: '#6B6B6B', fontSize: 14, fontFamily: 'Montserrat-Medium' },
  routeInfo: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF6CC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  routeInfoText: {
    color: '#1C1C1C',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  cardsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
  },
  cardPrimary: {
    backgroundColor: '#FFD977',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrimaryTitle: {
    color: '#1C1C1C',
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'Montserrat-Medium',
  },
  cardPrimaryTime: {
    marginTop: 12,
    color: '#1C1C1C',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
  },
  cardSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8E8',
  },
  cardSecondaryTitle: {
    color: '#1C1C1C',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Medium',
  },
  cardSecondaryTime: {
    marginTop: 10,
    color: '#8A8A8A',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  cardSecondaryIconWrap: { marginTop: 16, alignSelf: 'flex-start' },
  permissionToast: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: '#151513',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  permissionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
});