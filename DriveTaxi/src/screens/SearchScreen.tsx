import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Map } from '../components/Map';
import { ArrowLeft, MapPin, Car } from 'lucide-react-native';
import { GOOGLE_PLACES_API_KEY } from '../config/keys';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// Tipos simples para predictions
type PlacePrediction = {
  place_id: string;
  description: string;
};

// Opções de carros mockadas (UI/fluxo semelhante ao Uber)
type RideOption = {
  id: string;
  title: string;
  etaMin: number; // tempo de chegada
  seats: number;
  price: number;
};

const RIDE_OPTIONS: RideOption[] = [
  { id: 'comfort', title: 'Comfort', etaMin: 3, seats: 4, price: 8.5 },
  { id: 'delivery', title: 'Delivery', etaMin: 4, seats: 2, price: 6.7 },
  { id: 'suv', title: 'SUV', etaMin: 5, seats: 6, price: 12.2 },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const [pickupLabel] = useState('Minha localização');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlacePrediction[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<
    | null
    | {
        description: string;
        placeId: string;
        location?: { latitude: number; longitude: number };
      }
  >(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | undefined>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPredictions = useCallback(async (text: string) => {
    if (!text) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text,
      )}&key=${GOOGLE_PLACES_API_KEY}&language=pt-BR`;
      const res = await fetch(url);
      const json = await res.json();
      const predictions: PlacePrediction[] = (json.predictions || []).map((p: any) => ({
        place_id: p.place_id,
        description: p.description,
      }));
      setResults(predictions);
    } catch (e) {
      console.warn('[Search] fetch error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChange = (text: string) => {
    setQuery(text);
    setSelectedDestination(null);
    setSelectedRide(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchPredictions(text), 350);
  };

  const handleSelect = async (item: PlacePrediction) => {
    Keyboard.dismiss();
    setQuery(item.description);
    setResults([]);
    // Buscar detalhes/coords e então exibir opções de carros
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_PLACES_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      const loc = json.result?.geometry?.location;
      setSelectedDestination({
        description: item.description,
        placeId: item.place_id,
        location: loc ? { latitude: loc.lat, longitude: loc.lng } : undefined,
      });
    } catch (e) {
      // fallback sem coordenadas
      setSelectedDestination({
        description: item.description,
        placeId: item.place_id,
      });
    }
  };

  const onOrder = () => {
    if (!selectedDestination) return;
    navigation.replace('Home', {
      destination: {
        description: selectedDestination.description,
        placeId: selectedDestination.placeId,
        location: selectedDestination.location,
      },
    });
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const currency = (n: number) => `R$ ${n.toFixed(2)}`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Mapa de fundo */}
      <View style={[StyleSheet.absoluteFill, { paddingBottom: 340 }]}>
        <Map
          destination={selectedDestination?.location
            ? {
                latitude: selectedDestination.location.latitude,
                longitude: selectedDestination.location.longitude,
                title: selectedDestination.description,
                placeId: selectedDestination.placeId,
              }
            : undefined}
          onRouteInfo={(info) => setRouteInfo(info ? { distanceText: info.distanceText, durationText: info.durationText } : undefined)}
          carSize={{ width: 34, height: 18 }}
        />
      </View>

      {/* Gradiente para transição do mapa para o painel */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.92)", "#FFFFFF"]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      {/* Header fixo sobre o mapa */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1C1C1C" size={22} />
        </Pressable>
      </View>

      {/* Chip de informações da rota */}
      {selectedDestination && routeInfo && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>{routeInfo.durationText} • {routeInfo.distanceText}</Text>
        </View>
      )}

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Cartão com dois campos: origem (fixo) e destino (input) */}
        <View style={styles.searchCard}>
          <View style={styles.fieldRow}>
            <View style={styles.pinDot} />
            <Text style={styles.fieldStaticText} numberOfLines={1}>
              {pickupLabel}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.fieldRow}>
            <MapPin color="#1C1C1C" size={18} />
            <TextInput
              autoFocus
              placeholder="Para onde?"
              placeholderTextColor="#8A8A8A"
              value={query}
              onChangeText={onChange}
              style={[styles.input, { backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Lista de sugestões do Google */}
        {loading ? (
          <View style={styles.loading}><ActivityIndicator /></View>
        ) : results.length > 0 && !selectedDestination ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={i => i.place_id}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            style={styles.resultsList}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => handleSelect(item)}>
                <MapPin color="#1C1C1C" size={18} />
                <Text numberOfLines={2} style={styles.rowText}>
                  {item.description}
                </Text>
              </Pressable>
            )}
          />
        ) : null}

        {/* Após escolher o destino, exibe opções de carros */}
        {selectedDestination && (
          <View style={styles.ridesContainer}>
            <Text style={styles.ridesTitle}>Escolha seu carro</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              data={RIDE_OPTIONS}
              keyExtractor={i => i.id}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => {
                const selected = selectedRide?.id === item.id;
                return (
                  <Pressable
                    onPress={() => setSelectedRide(item)}
                    style={[styles.rideCard, selected && styles.rideCardSelected]}
                  >
                    <View style={styles.rideThumb}>
                      <Car color="#1C1C1C" size={28} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.rideTitle}>{item.title}</Text>
                        <Text style={styles.ridePrice}>{currency(item.price)}</Text>
                      </View>
                      <View style={styles.rideMetaRow}>
                        <Text style={styles.rideMeta}>{item.etaMin} min</Text>
                        <Text style={styles.rideMeta}>• {item.seats} lugares</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />

            {/* Pagamento (placeholder) */}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentText}>•••• 0872</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.paymentChange}>Alterar</Text>
              </Pressable>
            </View>

            <Pressable
              disabled={!selectedRide}
              onPress={onOrder}
              style={[styles.ctaButton, !selectedRide && { opacity: 0.5 }]}
            >
              <Text style={styles.ctaText}>Pedir agora</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
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
    left: 16,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  // Chip da rota
  routeInfo: {
    position: 'absolute',
    left: 16,
    bottom: 380,
    backgroundColor: '#151513',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  routeInfoText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  bottomSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F7F7F7',
    color: '#1C1C1C',
    fontFamily: 'Montserrat-Medium',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultsList: { maxHeight: 320, backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 12, marginTop: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: '#EAEAEA' },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#EAEAEA', marginLeft: 56 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowText: { flex: 1, color: '#1C1C1C', fontSize: 16 },

  // UI de dois campos
  searchCard: {
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#222',
    marginLeft: 4,
  },
  fieldStaticText: {
    flex: 1,
    color: '#1C1C1C',
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EAEAEA',
    marginLeft: 0,
  },

  // Lista de carros
  ridesContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EFEFEF',
    paddingTop: 12,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  ridesTitle: {
    fontSize: 16,
    color: '#1C1C1C',
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rideCard: {
    width: 300,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
  },
  rideCardSelected: {
    borderColor: '#111',
  },
  rideThumb: {
    width: 100,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#FFE58F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideTitle: { color: '#1C1C1C', fontSize: 16, fontWeight: '600' },
  ridePrice: { color: '#1C1C1C', fontSize: 16, fontWeight: '600' },
  rideMetaRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  rideMeta: { color: '#7A7A7A' },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
  },
  paymentText: { color: '#1C1C1C', fontSize: 16 },
  paymentChange: { color: '#8A8A8A', fontSize: 16 },

  ctaButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  ctaText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
