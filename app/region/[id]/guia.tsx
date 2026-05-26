import { getGuiaPorRegion } from '@/constants/api';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Item = {
  id: number;
  tip?: string;
  recomendacion?: string;
  regla?: string;
};

export default function GuiaScreen() {
  const pathname = usePathname();
  const regionId = parseInt(pathname.split('/')[2] ?? '0', 10);
  const [tips, setTips] = useState<Item[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Item[]>([]);
  const [conducta, setConducta] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!regionId) {
      setCargando(false);
      return;
    }

    getGuiaPorRegion(regionId)
      .then((data) => {
        setTips(Array.isArray(data.tips) ? data.tips : []);
        setRecomendaciones(Array.isArray(data.recomendaciones) ? data.recomendaciones : []);
        setConducta(Array.isArray(data.conducta) ? data.conducta : []);
      })
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [regionId]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const secciones = [
    {
      titulo: '🌿 Tips Ecológicos',
      color: '#4CAF50',
      datos: tips,
      getText: (item: Item) => item.tip ?? '',
      emoji: '🌱',
    },
    {
      titulo: '💡 Recomendaciones',
      color: '#007AFF',
      datos: recomendaciones,
      getText: (item: Item) => item.recomendacion ?? '',
      emoji: '💡',
    },
    {
      titulo: '📋 Código de Conducta',
      color: '#FF9800',
      datos: conducta,
      getText: (item: Item) => item.regla ?? '',
      emoji: '✅',
    },
  ];

  return (
    <FlatList
      data={secciones}
      keyExtractor={(item) => item.titulo}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.titulo}>Guía del Viajero</Text>}
      renderItem={({ item: seccion }) => (
        <View style={styles.seccion}>
          <View style={[styles.seccionHeader, { backgroundColor: seccion.color }]}>
            <Text style={styles.seccionTitulo}>{seccion.titulo}</Text>
          </View>
          {seccion.datos.length === 0 ? (
            <Text style={styles.vacio}>No hay información disponible</Text>
          ) : (
            seccion.datos.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemEmoji}>{seccion.emoji}</Text>
                <Text style={styles.itemTexto}>{seccion.getText(item)}</Text>
              </View>
            ))
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  seccion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  seccionHeader: { padding: 12 },
  seccionTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
    alignItems: 'flex-start',
  },
  itemEmoji: { fontSize: 18 },
  itemTexto: { flex: 1, color: '#333', lineHeight: 22, fontSize: 14 },
  vacio: { padding: 16, color: '#888', textAlign: 'center' },
});