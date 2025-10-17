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
//   Clock,
  ChevronDown,
  Coffee,
  Car,
  Icon,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useLocationPermission } from '../hooks/useLocationPermission';

import ClockIcon from '../../assets/svg/clock.svg';
import LocationIcon from '../../assets/svg/location.svg';
import MenuIcon from '../../assets/svg/menu.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ route, navigation }: Props) {
  const destination = route.params?.destination;
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | undefined>();
  const locPermission = useLocationPermission();

  return (
    <SafeAreaView style={styles.container}>
      {/* Mapa de fundo */}
      <View style={[StyleSheet.absoluteFill, { paddingBottom: 200}]}>
        <Map
          destination={destination?.location ? {
            latitude: destination.location.latitude,
            longitude: destination.location.longitude,
            title: destination.description,
          } : undefined}
          onRouteInfo={(info) => setRouteInfo(info ? { distanceText: info.distanceText, durationText: info.durationText } : undefined)}
          carSize={{ width: 34, height: 18 }}
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
            <MenuIcon />
          {/* <Menu color="#1C1C1C" size={22} /> */}
        </Pressable>
      </View>

      {/* Área inferior com busca e cards */}
      <View style={styles.bottomPanel}>
        {/* Barra de busca */}
        <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <View style={styles.searchLeft}>
            <LocationIcon />
            <Text style={styles.searchText} numberOfLines={1}>
              {destination?.description ?? 'Para onde?'}
            </Text>
          </View>
          <View style={styles.searchRight}>
            <ClockIcon />
            <Text style={styles.searchWhen}>Agora</Text>
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
            <Text style={styles.cardPrimaryTitle}>Angelina{"\n"}Paris Cafe</Text>
            <Text style={styles.cardPrimaryTime}>13 min</Text>
            <View style={styles.cardPrimaryIconWrap}>
              <Coffee color="#929292" size={30} />
            </View>
          </Pressable>

          <Pressable style={[styles.card, styles.cardSecondary]} onPress={() => {}}>
            <Text style={styles.cardSecondaryTitle}>Beco{"\n"}do Batman</Text>
            <Text style={styles.cardSecondaryTime}>20 min</Text>
            <View style={styles.cardSecondaryIconWrap}>
              <Car color="#929292" size={30} />
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
    height: 460,
  },
  header: {
    position: 'absolute',
    top: 48,
    left: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 200,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // sombra
    shadowColor: '#000',
    shadowOpacity: 0.20,
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
    height: 56,
    borderRadius: 200,
    backgroundColor: 'transparent',
    paddingLeft: 24,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DADADA',
  },
  searchLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  searchText: {
    color: '#151513',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  searchRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 200,
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
    marginTop: 24,
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    paddingBottom: 48,
  },
  cardPrimary: {
    backgroundColor: '#FFDC71',
    borderWidth: 1,
    borderColor: '#FFDC71',
    position: 'relative',
  },
  cardPrimaryTitle: {
    color: '#1C1C1C',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Montserrat-SemiBold',
  },
  cardPrimaryTime: {
    marginTop: 10,
    color: '#151513',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  cardPrimaryIconWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 24,
  },
  cardSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DADADA',
  },
  cardSecondaryTitle: {
    color: '#1C1C1C',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Montserrat-SemiBold',
  },
  cardSecondaryTime: {
    marginTop: 10,
    color: '#929292',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  cardSecondaryIconWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 24
  },
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