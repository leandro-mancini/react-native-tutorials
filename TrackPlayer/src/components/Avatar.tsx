import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { User } from 'lucide-react-native';

export type AvatarProps = {
  uri?: string | null;
  size?: number; // diâmetro
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string; // cor de fundo quando não há imagem
  name?: string; // usado para gerar iniciais
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

export function Avatar({
  uri,
  size = 64,
  borderWidth = 0,
  borderColor = 'transparent',
  backgroundColor = '#202020',
  name,
  style,
  imageStyle,
}: AvatarProps) {
  const [loading, setLoading] = useState<boolean>(!!uri);
  const [error, setError] = useState<boolean>(false);

  const S = size;
  const R = S / 2;

  const initials = useMemo(() => getInitials(name), [name]);
  const showFallback = !uri || error;

  return (
    <View
      style={[
        styles.container,
        {
          width: S,
          height: S,
          borderRadius: R,
          borderWidth,
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      {!showFallback && (
        <Image
          source={{ uri: uri as string }}
          style={[styles.image, { width: S, height: S, borderRadius: R }, imageStyle]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}

      {showFallback && (
        <View style={[styles.fallback, { borderRadius: R }]}> 
          {initials ? (
            <Text style={[styles.initials, { fontSize: Math.max(12, S * 0.38) }]}>
              {initials}
            </Text>
          ) : (
            <User color="#bfbfbf" size={Math.max(16, Math.floor(S * 0.55))} />
          )}
        </View>
      )}

      {loading && (
        <View style={[styles.loader, { borderRadius: R }]}> 
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#eaeaea',
    fontWeight: '700',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default Avatar;
