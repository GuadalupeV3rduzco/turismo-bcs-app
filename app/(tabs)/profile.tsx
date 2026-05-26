import { actualizarPerfil, cambiarContrasena } from '@/constants/api';
import { cerrarSesion, obtenerToken, obtenerUsuario } from '@/constants/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Usuario = {
  id: number;
  nombre_usuario: string;
  correo: string;
  foto_url: string | null;
};

export default function ProfileScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenaVerificacion, setContrasenaVerificacion] = useState('');
  const [verContrasenaVerificacion, setVerContrasenaVerificacion] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [verContrasenaActual, setVerContrasenaActual] = useState(false);
  const [verContrasenaNueva, setVerContrasenaNueva] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    const t = await obtenerToken();
    const u = await obtenerUsuario();
    if (!t || !u) {
      setCargando(false);
      return;
    }
    setToken(t);
    setUsuario(u);
    setNombreUsuario(u.nombre_usuario);
    setCorreo(u.correo);
    setCargando(false);
  };

  const handleGuardar = async () => {
    if (!token) return;

    if (correo !== usuario?.correo && !contrasenaVerificacion) {
      setError('Ingresa tu contraseña para cambiar el correo');
      return;
    }

    setGuardando(true);
    setError(null);
    try {
      const data = await actualizarPerfil({
        nombre_usuario: nombreUsuario,
        correo,
        contrasena_verificacion: contrasenaVerificacion
      }, token);

      if (data.error) {
        setError(data.error);
        return;
      }

      if (contrasenaActual && contrasenaNueva) {
        const dataPass = await cambiarContrasena(
          { contrasena_actual: contrasenaActual, contrasena_nueva: contrasenaNueva },
          token
        );
        if (dataPass.error) {
          setError(dataPass.error);
          return;
        }
      }

      setUsuario(data);
      setEditando(false);
      setContrasenaVerificacion('');
      setContrasenaActual('');
      setContrasenaNueva('');
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await cerrarSesion();
            router.dismissAll();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centro}>
        <Text style={styles.avisoTexto}>No has iniciado sesión</Text>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => router.push('/login' as any)}
        >
          <Text style={styles.botonTexto}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>
          {usuario?.nombre_usuario?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.nombre}>{usuario?.nombre_usuario}</Text>
      <Text style={styles.correo}>{usuario?.correo}</Text>

      <TouchableOpacity
        style={styles.botonEditar}
        onPress={() => {
          setEditando(!editando);
          setError(null);
          setContrasenaVerificacion('');
          setContrasenaActual('');
          setContrasenaNueva('');
        }}
      >
        <Text style={styles.botonEditarTexto}>
          {editando ? 'Cancelar' : 'Editar perfil'}
        </Text>
      </TouchableOpacity>

      {editando && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Editar información</Text>

          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {correo !== usuario?.correo && (
            <View>
              <Text style={styles.label}>Contraseña para confirmar cambio de correo</Text>
              <View style={styles.inputConIcono}>
                <TextInput
                  style={styles.inputPassword}
                  value={contrasenaVerificacion}
                  onChangeText={setContrasenaVerificacion}
                  secureTextEntry={!verContrasenaVerificacion}
                  placeholder="Ingresa tu contraseña actual"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setVerContrasenaVerificacion(!verContrasenaVerificacion)}>
                  <Text style={styles.verTexto}>{verContrasenaVerificacion ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.separador}>Cambiar contraseña (opcional)</Text>

          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputPassword}
              value={contrasenaActual}
              onChangeText={setContrasenaActual}
              secureTextEntry={!verContrasenaActual}
              placeholder="Dejar vacío para no cambiar"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setVerContrasenaActual(!verContrasenaActual)}>
              <Text style={styles.verTexto}>{verContrasenaActual ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputPassword}
              value={contrasenaNueva}
              onChangeText={setContrasenaNueva}
              secureTextEntry={!verContrasenaNueva}
              placeholder="Dejar vacío para no cambiar"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setVerContrasenaNueva(!verContrasenaNueva)}>
              <Text style={styles.verTexto}>{verContrasenaNueva ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.boton, guardando && { opacity: 0.6 }]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            {guardando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botonTexto}>Guardar cambios</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.botonCerrar} onPress={handleCerrarSesion}>
        <Text style={styles.botonCerrarTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  avatarTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nombre: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a' },
  correo: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  avisoTexto: { fontSize: 16, color: '#888', marginBottom: 8 },
  botonEditar: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonEditarTexto: { color: '#007AFF', fontWeight: '600' },
  seccion: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  seccionTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  separador: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 8,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  inputConIcono: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputPassword: { flex: 1, padding: 10, fontSize: 14 },
  verTexto: { fontSize: 18, padding: 4 },
  error: { color: 'red', fontSize: 13, marginBottom: 8 },
  boton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
  botonCerrar: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  botonCerrarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});