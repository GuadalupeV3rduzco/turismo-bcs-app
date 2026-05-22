import { login, registro } from '@/constants/api';
import { guardarSesion } from '@/constants/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

function validarContrasena(contrasena: string, correo: string, nombreUsuario: string): string | null {
  if (contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(contrasena)) return 'La contraseña debe tener al menos una mayúscula';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) return 'La contraseña debe tener al menos un carácter especial';

  const correoSinArroba = correo.split('@')[0].toLowerCase();
  if (contrasena.toLowerCase().includes(correoSinArroba)) {
    return 'La contraseña no puede contener tu correo';
  }
  if (contrasena.toLowerCase().includes(nombreUsuario.toLowerCase())) {
    return 'La contraseña no puede contener tu nombre de usuario';
  }
  return null;
}

export default function LoginScreen() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      setError('Completa todos los campos');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await login({ correo, contrasena });
      if (data.error) {
        setError(data.error);
        return;
      }
      await guardarSesion(data.token, data.usuario);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async () => {
    if (!correo || !contrasena || !nombreUsuario || !confirmarContrasena) {
      setError('Completa todos los campos');
      return;
    }
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const errorContrasena = validarContrasena(contrasena, correo, nombreUsuario);
    if (errorContrasena) {
      setError(errorContrasena);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await registro({ nombre_usuario: nombreUsuario, correo, contrasena });
      if (data.error) {
        setError(data.error);
        return;
      }
      await guardarSesion(data.token, data.usuario);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>
          {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </Text>
        <Text style={styles.subtitulo}>BCS Turismo Sostenible</Text>

        {modo === 'registro' && (
          <View style={styles.campo}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre de usuario"
              value={nombreUsuario}
              onChangeText={setNombreUsuario}
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.campo}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Tu contraseña"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!verContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
              <Text style={styles.verTexto}>{verContrasena ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {modo === 'registro' && (
          <>
            <View style={styles.campo}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputConIcono}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Repite tu contraseña"
                  value={confirmarContrasena}
                  onChangeText={setConfirmarContrasena}
                  secureTextEntry={!verConfirmar}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)}>
                  <Text style={styles.verTexto}>{verConfirmar ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.requisitos}>
              <Text style={styles.requisitosTitulo}>Requisitos de contraseña:</Text>
              <Text style={styles.requisito}>• Mínimo 8 caracteres</Text>
              <Text style={styles.requisito}>• Al menos una mayúscula</Text>
              <Text style={styles.requisito}>• Al menos un carácter especial (!@#$...)</Text>
              <Text style={styles.requisito}>• No puede contener tu correo o nombre de usuario</Text>
            </View>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.boton, cargando && { opacity: 0.6 }]}
          onPress={modo === 'login' ? handleLogin : handleRegistro}
          disabled={cargando}
        >
          {cargando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botonTexto}>
                {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cambiarModo}
          onPress={() => {
            setModo(modo === 'login' ? 'registro' : 'login');
            setError(null);
          }}
        >
          <Text style={styles.cambiarModoTexto}>
            {modo === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  campo: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  inputConIcono: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
  },
  inputPassword: { flex: 1, padding: 12, fontSize: 15 },
  verTexto: { fontSize: 20, padding: 4 },
  requisitos: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  requisitosTitulo: { fontWeight: 'bold', marginBottom: 4, color: '#333' },
  requisito: { color: '#555', fontSize: 13, marginBottom: 2 },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  boton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cambiarModo: { alignItems: 'center' },
  cambiarModoTexto: { color: '#007AFF', fontSize: 14 },
});