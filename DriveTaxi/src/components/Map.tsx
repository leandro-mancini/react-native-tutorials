import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { StyleSheet, View, Platform, ActivityIndicator } from "react-native";
import CarSvg from '../../assets/images/car.svg';
import PinSvg from '../../assets/svg/pin.svg';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Region,
  LatLng,
  UserLocationChangeEvent,
} from "react-native-maps";
import { GOOGLE_PLACES_API_KEY } from "../config/keys";

// Ícone do carro será desenhado via SVG (sem dependência de assets)

export type MapDestination = {
  latitude: number;
  longitude: number;
  title?: string;
  placeId?: string; // novo: permite usar place_id na rota
};

type RouteInfo = {
  distanceText: string;
  durationText: string;
  meters: number;
  seconds: number;
};

type Car = LatLng & { id: string; rotation: number };

type Props = {
  destination?: MapDestination | null;
  onRouteInfo?: (info: RouteInfo | undefined) => void;
  carSize?: { width: number; height: number };
};

const INITIAL_REGION: Region = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const DEFAULT_CAR_SIZE = { width: 34, height: 18 };

function decodePolyline(encoded: string): LatLng[] {
  // Decodificador padrão de polylines Google
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates: LatLng[] = [];

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coordinates;
}

export function Map({ destination, onRouteInfo, carSize }: Props) {
  const mapRef = useRef<MapView | null>(null);
  // Guardamos apenas o zoom (latitudeDelta) para reduzir re-renders que podem afetar tiles
  const [latDelta, setLatDelta] = useState<number>(INITIAL_REGION.latitudeDelta);
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [firstFix, setFirstFix] = useState(false);
  const moveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const markerSize = carSize ?? DEFAULT_CAR_SIZE;
  const [tracks, setTracks] = useState(true);
  const [tracksMap, setTracksMap] = useState<Record<string, boolean>>({});
  const lastLatDeltaRef = useRef<number>(INITIAL_REGION.latitudeDelta);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showNativeUserDot, setShowNativeUserDot] = useState(true);

  // Escala baseada no zoom: latitudeDelta menor = mais perto = ícone maior
  const zoomScale = useMemo(() => {
    const d = latDelta || INITIAL_REGION.latitudeDelta;
    const minD = 0.005; // muito perto
    const maxD = 0.5;   // bem afastado
    const clamped = Math.max(minD, Math.min(maxD, d));
    const t = (clamped - minD) / (maxD - minD); // 0..1
    return 1.4 - t * (1.4 - 0.6); // 0.6x (longe) → 1.4x (perto)
  }, [latDelta]);

  const currentSize = useMemo(() => ({
    width: markerSize.width * zoomScale,
    height: markerSize.height * zoomScale,
  }), [markerSize.height, markerSize.width, zoomScale]);

  // Após a primeira renderização, desligamos o tracking global (fallback)
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleReady = () => console.log("[Map] onMapReady");

  const onUserLocationChange = (e: UserLocationChangeEvent) => {
    const c = e.nativeEvent.coordinate;
    if (!c) return;
    const curr = { latitude: c.latitude, longitude: c.longitude };
    setUserLoc(curr);
    if (!firstFix) {
      setFirstFix(true);
      // Move a câmera para a localização atual ao abrir a Home (mais próximo)
      const initialDelta = 0.01;
      try {
        mapRef.current?.animateToRegion(
          {
            latitude: curr.latitude,
            longitude: curr.longitude,
            latitudeDelta: initialDelta,
            longitudeDelta: initialDelta,
          },
          800,
        );
        lastLatDeltaRef.current = initialDelta;
        setLatDelta(initialDelta);
      } catch {}

      // Gera carros ao redor do primeiro fix (~100–300m)
      const newCars: Car[] = Array.from({ length: 5 }).map((_, i) => {
        const dLat = Math.random() * 0.003 - 0.0015;
        const dLng = Math.random() * 0.003 - 0.0015;
        return {
          id: `car-${i}`,
          latitude: curr.latitude + dLat,
          longitude: curr.longitude + dLng,
          rotation: Math.floor(Math.random() * 360),
        };
      });
      setCars(newCars);

      // Após o primeiro fix, ocultamos o dot nativo e usamos nosso marcador customizado
      setShowNativeUserDot(false);
    }
  };
  
  const handleRegionChangeComplete = (r: Region) => {
    // Throttle: só atualiza se a variação de zoom for perceptível
    if (Math.abs(r.latitudeDelta - lastLatDeltaRef.current) > 0.0008) {
      lastLatDeltaRef.current = r.latitudeDelta;
      setLatDelta(r.latitudeDelta);
    }
  };

  const formatDistance = (meters?: number) => {
    if (!meters && meters !== 0) return '';
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters} m`;
  };
  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    // Routes API retorna no formato "1234s"
    const seconds = parseInt(duration.replace('s', ''), 10) || 0;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return `${h} h ${m} min`;
  };

  const fetchDirections = useCallback(async (origin: LatLng, dest: MapDestination) => {
    try {
      const body: any = {
        origin: { location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } } },
        destination: dest.placeId
          ? { placeId: dest.placeId }
          : { location: { latLng: { latitude: dest.latitude, longitude: dest.longitude } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        polylineQuality: 'HIGH_QUALITY',
        polylineEncoding: 'ENCODED_POLYLINE',
      };
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs',
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      const route = json.routes?.[0];
      if (!route) {
        console.warn('[Map] routes api empty', json); 
        setRouteCoords(null);
        onRouteInfo?.(undefined);
        return;
      }
      const encoded: string | undefined = route.polyline?.encodedPolyline;
      const meters: number | undefined = route.distanceMeters ?? route.legs?.[0]?.distanceMeters;
      const duration: string | undefined = route.duration ?? route.legs?.[0]?.duration;

      onRouteInfo?.({
        distanceText: formatDistance(meters),
        durationText: formatDuration(duration),
        meters: meters ?? 0,
        seconds: duration ? parseInt(duration.replace('s', ''), 10) || 0 : 0,
      });

      if (encoded) {
        const coords = decodePolyline(encoded);
        setRouteCoords(coords);
        if (mapRef.current && coords.length > 1) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 80, bottom: 340, left: 60, right: 60 },
            animated: true,
          });
        }
      } else {
        setRouteCoords(null);
      }
    } catch (e) {
      console.warn('[Map] routes api error', e);
      setRouteCoords(null);
      onRouteInfo?.(undefined);
    }
  }, [onRouteInfo]);

  // quando destino muda e já temos userLoc, busca rota
  useEffect(() => {
    if (destination && userLoc) {
      fetchDirections(userLoc, destination);
    } else {
      setRouteCoords(null);
      onRouteInfo?.(undefined);
    }
  }, [destination, userLoc, fetchDirections, onRouteInfo]);

  // animação simples dos carros (vagueando)
  useEffect(() => {
    if (cars.length === 0) return;
    if (moveTimer.current) clearInterval(moveTimer.current);
    moveTimer.current = setInterval(() => {
      setCars(prev => prev.map(car => {
        const dLat = (Math.random() - 0.5) * 0.0006; // ~60m
        const dLng = (Math.random() - 0.5) * 0.0006;
        const newLat = car.latitude + dLat;
        const newLng = car.longitude + dLng;
        const rotation = (Math.atan2(dLng, dLat) * 180) / Math.PI;
        return { ...car, latitude: newLat, longitude: newLng, rotation };
      }));
    }, 1800);
    return () => {
      if (moveTimer.current) clearInterval(moveTimer.current);
      moveTimer.current = null;
    };
  }, [cars.length]);

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => { mapRef.current = ref; }}
        testID="map-view"
        {...(Platform.OS === 'android' ? { provider: PROVIDER_GOOGLE } : {})}
        style={styles.map}
        onMapReady={handleReady}
        onMapLoaded={() => setMapLoaded(true)}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={showNativeUserDot}
        onUserLocationChange={onUserLocationChange}
        initialRegion={INITIAL_REGION}
        zoomControlEnabled={false}
        showsMyLocationButton={false}
      >
        {/* destino */}
        {destination && (
          <Marker
            coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
            title={destination.title || 'Destino'}
          />
        )}

        {/* localização do usuário (marcador customizado) */}
        {userLoc && (
          <Marker
            coordinate={userLoc}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <PinSvg width={48} height={48} />
          </Marker>
        )}

        {/* carros próximos */}
        {cars.map(car => (
          <Marker
            key={car.id}
            coordinate={{ latitude: car.latitude, longitude: car.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={car.rotation}
            flat
            tracksViewChanges={tracksMap[car.id] !== false}
          >
            <View
              collapsable={false}
              onLayout={() => setTracksMap(prev => ({ ...prev, [car.id]: false }))}
              style={{ transform: [{ rotate: `${car.rotation}deg` }] }}
            >
              <CarSvg width={119} height={102} />
            </View>
           </Marker>
         ))}

        {/* rota */}
        {routeCoords && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#1C1C1C"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* Overlay de loading próprio (evita NPE do loadingEnabled) */}
      {!mapLoaded && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color="#F0C53D" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});