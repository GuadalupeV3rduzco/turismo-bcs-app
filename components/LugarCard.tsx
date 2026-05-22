import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  nombre: string;
  descripcion?: string;
  imagen_url?: string | null;
  categoria?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

export default function LugarCard({ nombre, descripcion, imagen_url, categoria, onPress, children }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imagen_url ? (
        <Image source={{ uri: imagen_url }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderTexto}>📍</Text>
        </View>
      )}
      <View style={styles.overlay} />
      <View style={styles.info}>
        {categoria && <Text style={styles.categoria}>{categoria}</Text>}
        <Text style={styles.nombre}>{nombre}</Text>
        {descripcion && (
          <Text style={styles.descripcion} numberOfLines={2}>
            {descripcion}
          </Text>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});