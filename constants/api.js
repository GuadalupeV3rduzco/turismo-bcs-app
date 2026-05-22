const NODOS = [
  'https://bcs-backend-guadalupe-production.up.railway.app',  // Guadalupe (primario)
  'https://bcs-juan.railway.app',       // Juan (pendiente)
  'https://bcs-brayan.railway.app',     // Brayan (pendiente)
  'https://bcs-josea.railway.app',      // Jose Adan (pendiente)
  'https://bcs-sebastian.railway.app',  // Sebastian (pendiente)
];

async function fetchConTimeout(url, ms = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(url)
      .then(res => { clearTimeout(timer); resolve(res); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
}

async function getNodoActivo() {
  for (const nodo of NODOS) {
    try {
      const res = await fetchConTimeout(`${nodo}/health`, 500);
      if (res.ok) return nodo;
    } catch {
      console.warn(`Nodo caído: ${nodo}, probando siguiente...`);
    }
  }
  throw new Error('Todos los nodos están caídos');
}

export async function apiCall(endpoint, options = {}) {
  const nodo = await getNodoActivo();
  const res = await fetch(`${nodo}${endpoint}`, options);
  return res.json();
}

// REGIONES
export const getRegiones = () => apiCall('/api/regiones');

// CATEGORIAS
export const getCategorias = () => apiCall('/api/categorias');

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
export const getActividadesPorRegion = (id) => apiCall(`/api/actividades/region/${id}`);
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
export const getResenasPorRegion = (id) => apiCall(`/api/resenas/region/${id}`);
export const agregarResena = (datos, token) => apiCall('/api/resenas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(datos)
});

// AUTENTICACIÓN
export const registro = (datos) => apiCall('/api/auth/registro', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

export const login = (datos) => apiCall('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});

export const getPerfil = (token) => apiCall('/api/auth/perfil', {
  headers: { Authorization: `Bearer ${token}` }
});

export const actualizarPerfil = (datos, token) => apiCall('/api/auth/perfil', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(datos)
});

export const cambiarContrasena = (datos, token) => apiCall('/api/auth/contrasena', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(datos)
});

// NODOS Y REPLICACIÓN
export const getNodos = () => apiCall('/api/nodos');
export const getEstadoReplicacion = () => apiCall('/api/replicacion/estado');