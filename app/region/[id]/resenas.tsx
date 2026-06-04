import ResenaCard from '@/components/ResenaCard';
import { agregarResena, getLugaresPorRegion, getResenasPorRegion } from '@/constants/api';
import { obtenerToken, obtenerUsuario } from '@/constants/auth';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  lugar_nombre?: string;
  actividad_nombre?: string;
};

type Usuario = {
  id: number;
  nombre_usuario: string;
};

type Lugar = {
  id: number;
  nombre: string;
};

export default function ResenasScreen() {
  const pathname = usePathname();
  const regionId = pathname.split('/')[2];
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState<Lugar | null>(null);
  const [mostrarSelectorLugar, setMostrarSelectorLugar] = useState(false);

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

    try {
      const [resenasData, lugaresData] = await Promise.all([
        getResenasPorRegion(idNumerico),
        getLugaresPorRegion(idNumerico),
      ]);
      setResenas(Array.isArray(resenasData) ? resenasData : []);
      setLugares(Array.isArray(lugaresData) ? lugaresData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const enviarResena = async () => {
    if (!usuario || !token) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!lugarSeleccionado) {
      Alert.alert('Selecciona un lugar', 'Elige el lugar sobre el que quieres opinar');
      return;
    }
    if (!titulo.trim() || !comentario.trim()) {
      Alert.alert('Campos incompletos', 'Completa el título y comentario');
      return;
    }

    setEnviando(true);
    try {
      const nueva = await agregarResena({
        lugar_id: lugarSeleccionado.id,
        usuario_id: usuario.id,
        titulo,
        comentario,
        estrellas,
      }, token);

      if (nueva.error) {
        Alert.alert('Error', nueva.error);
        return;
      }

      setResenas([{
        ...nueva,
        nombre_usuario: usuario.nombre_usuario,
        lugar_nombre: lugarSeleccionado.nombre,
      }, ...resenas]);
      setTitulo('');
      setComentario('');
      setEstrellas(5);
      setLugarSeleccionado(null);
      setMostrarFormulario(false);
      Alert.alert('¡Gracias!', 'Tu reseña fue publicada');
    } catch (err) {
      Alert.alert('Error', 'No se pudo publicar la reseña');
    } finally {
      setEnviando(false);
    }
  };

  // Obtener nombre del lugar para cada reseña
  const getNombreLugar = (lugar_id: number) => {
    const lugar = lugares.find(l => l.id === lugar_id);
    return lugar?.nombre ?? 'Lugar desconocido';
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

            {mostrarFormulario && (
              <View style={styles.formulario}>
                <Text style={styles.formTitulo}>Tu reseña</Text>

                {/* Selector de lugar */}
                <Text style={styles.label}>Lugar a reseñar</Text>
                <TouchableOpacity
                  style={styles.selectorLugar}
                  onPress={() => setMostrarSelectorLugar(!mostrarSelectorLugar)}
                >
                  <Text style={lugarSeleccionado ? styles.lugarSeleccionadoTexto : styles.lugarPlaceholder}>
                    {lugarSeleccionado ? lugarSeleccionado.nombre : 'Selecciona un lugar...'}
                  </Text>
                  <Text style={styles.selectorIcono}>{mostrarSelectorLugar ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {mostrarSelectorLugar && (
                  <View style={styles.listaLugares}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                      {lugares.map((lugar) => (
                        <TouchableOpacity
                          key={lugar.id}
                          style={[
                            styles.opcionLugar,
                            lugarSeleccionado?.id === lugar.id && styles.opcionLugarSeleccionada
                          ]}
                          onPress={() => {
                            setLugarSeleccionado(lugar);
                            setMostrarSelectorLugar(false);
                          }}
                        >
                          <Text style={[
                            styles.opcionLugarTexto,
                            lugarSeleccionado?.id === lugar.id && styles.opcionLugarTextoSeleccionado
                          ]}>
                            {lugar.nombre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

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
              <Text style={styles.vacio}>Sé el primero en dejar una reseña</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <View style={styles.lugarBadge}>
              <Text style={styles.lugarBadgeTexto}>
                📍 {item.lugar_nombre ?? item.actividad_nombre ?? 'Sin ubicación'}
              </Text>
            </View>
            <ResenaCard
              nombre_usuario={item.nombre_usuario ?? item.usuario ?? 'Usuario'}
              titulo={item.titulo}
              comentario={item.comentario}
              estrellas={item.estrellas}
              fecha={item.creado_en}
            />
          </View>
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
  selectorLugar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lugarPlaceholder: { color: '#aaa', fontSize: 14 },
  lugarSeleccionadoTexto: { color: '#1a1a1a', fontSize: 14, fontWeight: '600' },
  selectorIcono: { color: '#888', fontSize: 12 },
  listaLugares: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  opcionLugar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  opcionLugarSeleccionada: {
    backgroundColor: '#e8f4ff',
  },
  opcionLugarTexto: { fontSize: 14, color: '#333' },
  opcionLugarTextoSeleccionado: { color: '#007AFF', fontWeight: 'bold' },
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
  lugarBadge: {
    backgroundColor: '#e8f4ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 8,
  },
  lugarBadgeTexto: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
});