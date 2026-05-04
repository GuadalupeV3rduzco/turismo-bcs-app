const MI_IP = 'http://192.168.100.8:3001';

export async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${MI_IP}${endpoint}`, options);
  return res.json();
}

// REGIONES
export const getRegiones = () => apiCall('/api/regiones');

// LUGARES
export const getLugares = () => apiCall('/api/lugares');
export const getLugaresPorRegion = (id) => apiCall(`/api/lugares/region/${id}`);
export const getLugar = (id) => apiCall(`/api/lugares/${id}`);
export const agregarLugar = (datos) => apiCall('/api/lugares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// ACTIVIDADES
export const getActividades = (lugarId) => apiCall(`/api/actividades/lugar/${lugarId}`);
export const agregarActividad = (datos) => apiCall('/api/actividades', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// FOTOS
export const getFotos = (lugarId) => apiCall(`/api/fotos/lugar/${lugarId}`);
export const agregarFoto = (datos) => apiCall('/api/fotos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// TIPS ECOLOGÍA
export const getTips = (lugarId) => apiCall(`/api/tips/lugar/${lugarId}`);
export const agregarTip = (datos) => apiCall('/api/tips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// RECOMENDACIONES
export const getRecomendaciones = (lugarId) => apiCall(`/api/recomendaciones/lugar/${lugarId}`);
export const agregarRecomendacion = (datos) => apiCall('/api/recomendaciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// LOCALES DE COMIDA
export const getComida = (lugarId) => apiCall(`/api/comida/lugar/${lugarId}`);
export const agregarComida = (datos) => apiCall('/api/comida', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// CÓDIGOS DE CONDUCTA
export const getConducta = (lugarId) => apiCall(`/api/conducta/lugar/${lugarId}`);
export const agregarConducta = (datos) => apiCall('/api/conducta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// RESEÑAS
export const getResenas = (lugarId) => apiCall(`/api/resenas/lugar/${lugarId}`);
export const agregarResena = (datos) => apiCall('/api/resenas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

// NODOS Y REPLICACIÓN
export const getNodos = () => apiCall('/api/nodos');
export const getEstadoReplicacion = () => apiCall('/api/replicacion/estado');