import { StyleSheet, Text, View } from 'react-native';

type Props = {
  nombre_usuario: string;
  titulo?: string;
  comentario: string;
  estrellas: number;
  fecha: string;
};

export default function ResenaCard({ nombre_usuario, titulo, comentario, estrellas, fecha }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {nombre_usuario?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.usuario}>{nombre_usuario}</Text>
          <Text style={styles.estrellas}>
            {'★'.repeat(estrellas)}{'☆'.repeat(5 - estrellas)}
          </Text>
        </View>
        <Text style={styles.fecha}>
          {new Date(fecha).toLocaleDateString('es-MX')}
        </Text>
      </View>
      {titulo && <Text style={styles.titulo}>{titulo}</Text>}
      <Text style={styles.comentario}>{comentario}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerInfo: { flex: 1 },
  usuario: { fontWeight: 'bold', fontSize: 14, color: '#1a1a1a' },
  estrellas: { color: '#FFD700', fontSize: 14 },
  fecha: { color: '#aaa', fontSize: 12 },
  titulo: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 4 },
  comentario: { color: '#555', lineHeight: 20, fontSize: 14 },
});