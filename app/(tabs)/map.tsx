import { Platform, Text, View } from 'react-native';
import { useRef } from 'react';
import { router, Href } from 'expo-router';

export default function MapScreen() {
  // 🧠 Evita error en web
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>El mapa solo está disponible en la app móvil 📱</Text>
      </View>
    );
  }

  const MapView = require('react-native-maps').default;
  const { Marker } = require('react-native-maps');

const mapRef = useRef<any>(null);
  const regiones = [
    { id: 'lapaz', title: 'La Paz', latitude: 24.1426, longitude: -110.3128 },
    { id: 'cabos', title: 'Los Cabos', latitude: 22.8905, longitude: -109.9167 },
    { id: 'comondu', title: 'Comondú', latitude: 25.0321, longitude: -111.6645 },
    { id: 'mulege', title: 'Mulegé', latitude: 26.8872, longitude: -111.9811 },
    { id: 'loreto', title: 'Loreto', latitude: 26.0112, longitude: -111.3474 },
  ];

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 24.5,
        longitude: -111.5,
        latitudeDelta: 4,
        longitudeDelta: 4,
      }}
      mapType="standard"
    >
      {regiones.map((region) => (
        <Marker
          key={region.id}
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title={region.title}
          onPress={() => {
            mapRef.current?.animateToRegion(
              {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              },
              1000
            );
          }}
          onCalloutPress={() =>
            router.push(`/region/${region.id}` as Href)
          }
        />
      ))}
    </MapView>
  );
}