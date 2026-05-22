import ResenaCard from '@/components/ResenaCard';
import { agregarResena, getResenasPorRegion } from '@/constants/api';
import { obtenerToken, obtenerUsuario } from '@/constants/auth';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Resena = {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  usuario: string;
  titulo: string;
  comentario: string;
  estrellas: number;
  creado_en: string;
  lugar_id: number;
};
type Usuario = {
  id: number;
  nombre_usuario: string;
};

export default function ResenasScreen() {
  const pathname = usePathname();
  const regionId = pathname.split('/')[2];
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [regionId]);

  const cargarDatos = async () => {
    const t = await obtenerToken();
    const u = await obtenerUsuario();
    setToken(t);
    setUsuario(u);

    const idNumerico = parseInt(regionId ?? '0', 10);
    if (isNaN(idNumerico) || idNumerico === 0) {
      setCargando(false);
      return;
    }

    getResenasPorRegion(idNumerico)
      .then((data) => setResenas(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setCargando(false));
  };

  const enviarResena = async () => {
    if (!usuario || !token) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!titulo.trim() || !comentario.trim()) {
      Alert.alert('Campos incompletos', 'Completa el título y comentario');
      return;
    }

    setEnviando(true);
    try {
      const nueva = await agregarResena({
        lugar_id: parseInt(regionId, 10),
        usuario_id: usuario.id,
        titulo,
        comentario,
        estrellas,
      }, token);

      if (nueva.error) {
        Alert.alert('Error', nueva.error);
        return;
      }

      setResenas([{ ...nueva, nombre_usuario: usuario.nombre_usuario }, ...resenas]);
      setTitulo('');
      setComentario('');
      setEstrellas(5);
      setMostrarFormulario(false);
      Alert.alert('¡Gracias!', 'Tu reseña fue publicada');
    } catch (err) {
      Alert.alert('Error', 'No se pudo publicar la reseña');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={resenas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Reseñas</Text>

            {/* Botón agregar reseña */}
            {usuario ? (
              <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => setMostrarFormulario(!mostrarFormulario)}
              >
                <Text style={styles.botonAgregarTexto}>
                  {mostrarFormulario ? 'Cancelar' : '+ Escribir reseña'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.avisoLogin}>
                Inicia sesión para dejar una reseña
              </Text>
            )}

            {/* Formulario */}
            {mostrarFormulario && (
              <View style={styles.formulario}>
                <Text style={styles.formTitulo}>Tu reseña</Text>

                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Resumen de tu experiencia"
                  value={titulo}
                  onChangeText={setTitulo}
                />

                <Text style={styles.label}>Comentario</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Cuéntanos tu experiencia..."
                  value={comentario}
                  onChangeText={setComentario}
                  multiline
                />

                <Text style={styles.label}>Calificación</Text>
                <View style={styles.estrellasRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => setEstrellas(n)}>
                      <Text style={{ fontSize: 32, color: n <= estrellas ? '#FFD700' : '#ccc' }}>
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.botonEnviar, enviando && { opacity: 0.6 }]}
                  onPress={enviarResena}
                  disabled={enviando}
                >
                  {enviando
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.botonEnviarTexto}>Publicar reseña</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            {resenas.length === 0 && (
              <Text style={styles.vacio}>
                Sé el primero en dejar una reseña
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ResenaCard
            nombre_usuario={item.nombre_usuario ?? item.usuario ?? 'Usuario'}
            titulo={item.titulo}
            comentario={item.comentario}
            estrellas={item.estrellas}
            fecha={item.creado_en}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  botonAgregar: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonAgregarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  avisoLogin: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 16,
    fontSize: 14,
  },
  formulario: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  estrellasRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  botonEnviar: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonEnviarTexto: { color: '#fff', fontWeight: 'bold' },
  vacio: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 15,
  },
});