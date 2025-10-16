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
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { GOOGLE_PLACES_API_KEY } from '../config/keys';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// Tipos simples para predictions
type PlacePrediction = {
  place_id: string;
  description: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlacePrediction[]>([]);
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
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchPredictions(text), 350);
  };

  const handleSelect = async (item: PlacePrediction) => {
    Keyboard.dismiss();
    // Opcional: buscar detalhes/coords
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_PLACES_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      const loc = json.result?.geometry?.location;
      navigation.replace('Home', {
        destination: {
          description: item.description,
          placeId: item.place_id,
          location: loc
            ? { latitude: loc.lat, longitude: loc.lng }
            : undefined,
        },
      });
    } catch (e) {
      // fallback sem coordenadas
      navigation.replace('Home', {
        destination: {
          description: item.description,
          placeId: item.place_id,
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1C1C1C" size={22} />
        </Pressable>
        <TextInput
          autoFocus
          placeholder="Para onde?"
          placeholderTextColor="#8A8A8A"
          value={query}
          onChangeText={onChange}
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={results}
          keyExtractor={i => i.place_id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    gap: 8,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
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
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#EAEAEA', marginLeft: 56 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowText: { flex: 1, color: '#1C1C1C', fontSize: 16 },
});
