import LugarCard from '@/components/LugarCard';
import { getLugaresPorRegion } from '@/constants/api';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Lugar = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  categoria: string;
};

export default function RegionHome() {
  const pathname = usePathname();
  const regionId = pathname.split('/')[2];
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const idNumerico = parseInt(regionId ?? '0', 10);
    if (isNaN(idNumerico) || idNumerico === 0) {
      setCargando(false);
      return;
    }
    getLugaresPorRegion(idNumerico)
      .then((data) => setLugares(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [regionId]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#888' }}>Cargando lugares...</Text>
      </View>
    );
  }

  if (lugares.length === 0) {
    return (
      <View style={styles.centro}>
        <Text style={styles.vacio}>No hay lugares registrados</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lugares}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.titulo}>Lugares Turísticos</Text>}
      renderItem={({ item }) => (
        <LugarCard
          nombre={item.nombre}
          descripcion={item.descripcion}
          imagen_url={item.imagen_url}
          categoria={item.categoria}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  vacio: { fontSize: 16, color: '#888' },
});