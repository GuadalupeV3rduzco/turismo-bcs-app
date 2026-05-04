import RegionCard from '@/components/RegionCard';
import { getRegiones } from '@/constants/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Region = {
  id: number;
  nombre: string;
  descripcion: string;
};

// Imágenes locales por región
const imagenes: Record<string, any> = {
  'La Paz':      require('@/assets/images/lapaz.jpg'),
  'Los Cabos':   require('@/assets/images/cabos.jpg'),
  'Comondú':     require('@/assets/images/comondu.jpg'),
  'Mulegé':      require('@/assets/images/mulege.jpg'),
  'Loreto':      require('@/assets/images/loreto.jpg'),
};

export default function HomeScreen() {
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRegiones()
      .then(setRegiones)
      .catch((err: Error) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Conectando al nodo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={regiones}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RegionCard
          title={item.nombre}
          id={item.id.toString()}
          image={imagenes[item.nombre]}
        />
      )}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Text style={styles.title}>Explora Baja California Sur</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  error: {
    color: 'red',
  },
});