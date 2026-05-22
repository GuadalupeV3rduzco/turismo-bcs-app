import { getActividadesPorRegion } from '@/constants/api';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  dificultad: string;
  imagen_url: string | null;
  categoria: string;
};

const colorDificultad: Record<string, string> = {
  'Baja':  '#4CAF50',
  'Media': '#FF9800',
  'Alta':  '#F44336',
};

export default function DirectorioScreen() {
  const pathname = usePathname();
  const regionId = pathname.split('/')[2];
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idNumerico = parseInt(regionId ?? '0', 10);

    if (isNaN(idNumerico) || idNumerico === 0) {
      setCargando(false);
      return;
    }

    getActividadesPorRegion(idNumerico)
      .then((data) => {
        setActividades(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
        setActividades([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [regionId]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#888' }}>Cargando actividades...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (actividades.length === 0) {
    return (
      <View style={styles.centro}>
        <Text style={styles.vacio}>No hay actividades registradas</Text>
        <Text style={{ color: '#aaa', marginTop: 4 }}>Región ID: {regionId}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={actividades}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Text style={styles.titulo}>Actividades</Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          {item.imagen_url ? (
            <Image source={{ uri: item.imagen_url }} style={styles.imagen} />
          ) : (
            <View style={styles.imagenPlaceholder}>
              <Text style={styles.placeholderTexto}>🏄</Text>
            </View>
          )}
          <View style={styles.overlay} />
          <View style={styles.info}>
            <Text style={styles.categoria}>{item.categoria}</Text>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.descripcion} numberOfLines={2}>
              {item.descripcion}
            </Text>
            <View style={styles.tags}>
              <View style={styles.tag}>
                <Text style={styles.tagTexto}>⏱ {item.duracion}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colorDificultad[item.dificultad] ?? '#888' }]}>
                <Text style={styles.tagTexto}>{item.dificultad}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  vacio: { fontSize: 16, color: '#888' },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: 220,
    backgroundColor: '#ccc',
  },
  imagen: { width: '100%', height: '100%', position: 'absolute' },
  imagenPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTexto: { fontSize: 40 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  info: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  categoria: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descripcion: {
    color: '#eee',
    fontSize: 12,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});