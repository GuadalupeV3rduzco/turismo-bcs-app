import ResenaCard from '@/components/ResenaCard';
import { agregarResena, getResenasPorActividad } from '@/constants/api';
import { obtenerToken, obtenerUsuario } from '@/constants/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  dificultad: string;
  costo_promedio: string | null;
  imagen_url: string | null;
  categoria: string;
  region_id: number;
  lugar_id: number;
};

type Resena = {
  id: number;
  usuario: string;
  usuario_id: number;
  nombre_usuario: string;
  titulo: string;
  comentario: string;
  estrellas: number;
  creado_en: string;
};

type Usuario = {
  id: number;
  nombre_usuario: string;
};

const colorDificultad: Record<string, string> = {
  'Baja': '#4CAF50',
  'Media': '#FF9800',
  'Alta': '#F44336',
};

export default function ActividadDetalle() {
  const { id, nombre, descripcion, duracion, dificultad, costo_promedio, imagen_url, categoria } = useLocalSearchParams();
  const actividadId = parseInt(id as string, 10);

  const actividad: Actividad = {
    id: actividadId,
    nombre: nombre as string,
    descripcion: descripcion as string,
    duracion: duracion as string,
    dificultad: dificultad as string,
    costo_promedio: costo_promedio as string ?? null,
    imagen_url: imagen_url as string ?? null,
    categoria: categoria as string,
    region_id: 0,
    lugar_id: 0,
  };

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [actividadId]);

  const cargarDatos = async () => {
    const t = await obtenerToken();
    const u = await obtenerUsuario();
    setToken(t);
    setUsuario(u);
    try {
      const resenasData = await getResenasPorActividad(actividadId);
      setResenas(Array.isArray(resenasData) ? resenasData : []);
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
    if (!titulo.trim() || !comentario.trim()) {
      Alert.alert('Campos incompletos', 'Completa el título y comentario');
      return;
    }
    setEnviando(true);
    try {
      const nueva = await agregarResena({
        actividad_id: actividadId,
        lugar_id: null,
        usuario_id: usuario.id,
        titulo,
        comentario,
        estrellas,
      }, token);
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

  const promedioEstrellas = resenas.length > 0
    ? (resenas.reduce((acc, r) => acc + r.estrellas, 0) / resenas.length).toFixed(1)
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {/* Imagen principal */}
        <View style={styles.imagenContainer}>
          {actividad.imagen_url ? (
            <Image source={{ uri: actividad.imagen_url }} style={styles.imagen} />
          ) : (
            <View style={[styles.imagen, styles.imagenPlaceholder]}>
              <Text style={styles.placeholderTexto}>🏄</Text>
            </View>
          )}
          <View style={styles.imagenOverlay} />

          <TouchableOpacity style={styles.botonRegresar} onPress={() => router.back()}>
            <Text style={styles.flechaRegresar}>‹</Text>
          </TouchableOpacity>

          <View style={styles.infoSobreImagen}>
            <Text style={styles.categoria}>{actividad.categoria?.toUpperCase()}</Text>
            <Text style={styles.nombre}>{actividad.nombre}</Text>
            <View style={styles.ratingRow}>
              {promedioEstrellas && (
                <>
                  <Text style={styles.estrellasPromedio}>★ {promedioEstrellas}</Text>
                  <Text style={styles.totalResenas}>({resenas.length} reseñas)</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>📍 Sobre esta actividad</Text>
          <Text style={styles.descripcion}>{actividad.descripcion}</Text>
        </View>

        {/* Info práctica */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>ℹ️ Información práctica</Text>

          <View style={styles.infoFila}>
            <Text style={styles.infoIcono}>⏱</Text>
            <View style={styles.infoTextoContainer}>
              <Text style={styles.infoLabel}>Duración</Text>
              <Text style={styles.infoTexto}>{actividad.duracion}</Text>
            </View>
          </View>

          <View style={styles.infoFila}>
            <Text style={styles.infoIcono}>💪</Text>
            <View style={styles.infoTextoContainer}>
              <Text style={styles.infoLabel}>Dificultad</Text>
              <View style={[styles.tagDificultad, { backgroundColor: colorDificultad[actividad.dificultad] ?? '#888' }]}>
                <Text style={styles.tagTexto}>{actividad.dificultad}</Text>
              </View>
            </View>
          </View>

          {actividad.costo_promedio && (
            <View style={styles.infoFila}>
              <Text style={styles.infoIcono}>💰</Text>
              <View style={styles.infoTextoContainer}>
                <Text style={styles.infoLabel}>Costo promedio</Text>
                <Text style={[styles.infoTexto, { color: '#4CAF50', fontWeight: '600' }]}>
                  {actividad.costo_promedio}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Reseñas */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>⭐ Reseñas</Text>

          {usuario ? (
            <TouchableOpacity
              style={styles.botonAgregarResena}
              onPress={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <Text style={styles.botonAgregarResenaTexto}>
                {mostrarFormulario ? 'Cancelar' : '+ Escribir reseña'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.avisoLogin}>Inicia sesión para dejar una reseña</Text>
          )}

          {mostrarFormulario && (
            <View style={styles.formulario}>
              <TextInput
                style={styles.input}
                placeholder="Título de tu reseña"
                value={titulo}
                onChangeText={setTitulo}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Cuéntanos tu experiencia..."
                value={comentario}
                onChangeText={setComentario}
                multiline
              />
              <View style={styles.estrellasRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setEstrellas(n)}>
                    <Text style={{ fontSize: 28, color: n <= estrellas ? '#FFD700' : '#ccc' }}>★</Text>
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

          {cargando ? (
            <ActivityIndicator color="#007AFF" />
          ) : resenas.length === 0 ? (
            <Text style={styles.vacio}>Sé el primero en dejar una reseña</Text>
          ) : (
            resenas.map((item) => (
              <ResenaCard
                key={item.id}
                nombre_usuario={item.nombre_usuario ?? item.usuario ?? 'Usuario'}
                titulo={item.titulo}
                comentario={item.comentario}
                estrellas={item.estrellas}
                fecha={item.creado_en}
              />
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  imagenContainer: { height: 280, position: 'relative' },
  imagen: { width: '100%', height: '100%' },
  imagenPlaceholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  placeholderTexto: { fontSize: 60 },
  imagenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  botonRegresar: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flechaRegresar: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
  },
  infoSobreImagen: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  categoria: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  nombre: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  estrellasPromedio: { color: '#FFD700', fontSize: 14, fontWeight: 'bold' },
  totalResenas: { color: '#eee', fontSize: 12 },
  seccion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  seccionTitulo: { fontSize: 17, fontWeight: 'bold', marginBottom: 12, color: '#1a1a1a' },
  descripcion: { color: '#555', lineHeight: 22, fontSize: 15 },
  infoFila: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  infoIcono: { fontSize: 20 },
  infoTextoContainer: { flex: 1 },
  infoLabel: { fontWeight: 'bold', fontSize: 13, color: '#333', marginBottom: 4 },
  infoTexto: { color: '#555', fontSize: 13, lineHeight: 18 },
  tagDificultad: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  tagTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  botonAgregarResena: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonAgregarResenaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  avisoLogin: { textAlign: 'center', color: '#888', marginBottom: 16 },
  formulario: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  estrellasRow: { flexDirection: 'row', marginBottom: 10, gap: 4 },
  botonEnviar: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonEnviarTexto: { color: '#fff', fontWeight: 'bold' },
  vacio: { textAlign: 'center', color: '#888', marginTop: 8 },
});