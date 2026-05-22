import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'bcs_token';
const USUARIO_KEY = 'bcs_usuario';

export async function guardarSesion(token, usuario) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export async function obtenerToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function obtenerUsuario() {
  const data = await AsyncStorage.getItem(USUARIO_KEY);
  return data ? JSON.parse(data) : null;
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USUARIO_KEY);
}

export async function estaLogueado() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return token !== null;
}