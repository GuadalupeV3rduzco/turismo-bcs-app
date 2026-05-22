import { Href, router } from 'expo-router';
import { useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';

const regiones = [
  { id: '1', title: 'La Paz',    latitude: 24.1426, longitude: -110.3128 },
  { id: '2', title: 'Los Cabos', latitude: 22.8905, longitude: -109.9167 },
  { id: '5', title: 'Comondú',   latitude: 25.0321, longitude: -111.6645 },
  { id: '4', title: 'Mulegé',    latitude: 26.8872, longitude: -111.9811 },
  { id: '3', title: 'Loreto',    latitude: 26.0112, longitude: -111.3474 },
];

export default function MapaRegiones() {
  const mapRef = useRef<any>(null);

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
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title={region.title}
          onPress={() => {
            mapRef.current?.animateToRegion(
              { latitude: region.latitude, longitude: region.longitude, latitudeDelta: 0.5, longitudeDelta: 0.5 },
              1000
            );
          }}
          onCalloutPress={() => router.push(`/region/${region.id}` as Href)}
        />
      ))}
    </MapView>
  );
}