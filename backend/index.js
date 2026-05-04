const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', nodo: 'Guadalupe', primario: true });
});

// ✅ REGIONES
app.get('/api/regiones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM regiones');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LUGARES
app.get('/api/lugares', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT l.*, r.nombre as region FROM lugares l JOIN regiones r ON l.region_id = r.id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lugares/region/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lugares WHERE region_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lugares/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lugares WHERE id = $1', [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lugares', async (req, res) => {
  try {
    const { region_id, nombre, descripcion, latitud, longitud } = req.body;
    const result = await pool.query(
      `INSERT INTO lugares (region_id, nombre, descripcion, latitud, longitud)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [region_id, nombre, descripcion, latitud, longitud]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ACTIVIDADES
app.get('/api/actividades/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM actividades WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/actividades', async (req, res) => {
  try {
    const { lugar_id, nombre, descripcion, duracion, dificultad } = req.body;
    const result = await pool.query(
      `INSERT INTO actividades (lugar_id, nombre, descripcion, duracion, dificultad)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [lugar_id, nombre, descripcion, duracion, dificultad]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FOTOS
app.get('/api/fotos/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fotos WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fotos', async (req, res) => {
  try {
    const { lugar_id, url, descripcion } = req.body;
    const result = await pool.query(
      `INSERT INTO fotos (lugar_id, url, descripcion)
       VALUES ($1,$2,$3) RETURNING *`,
      [lugar_id, url, descripcion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ TIPS ECOLOGÍA
app.get('/api/tips/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tips_ecologia WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tips', async (req, res) => {
  try {
    const { lugar_id, tip } = req.body;
    const result = await pool.query(
      `INSERT INTO tips_ecologia (lugar_id, tip) VALUES ($1,$2) RETURNING *`,
      [lugar_id, tip]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ RECOMENDACIONES
app.get('/api/recomendaciones/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recomendaciones WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/recomendaciones', async (req, res) => {
  try {
    const { lugar_id, recomendacion } = req.body;
    const result = await pool.query(
      `INSERT INTO recomendaciones (lugar_id, recomendacion) VALUES ($1,$2) RETURNING *`,
      [lugar_id, recomendacion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOCALES DE COMIDA
app.get('/api/comida/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM locales_comida WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comida', async (req, res) => {
  try {
    const { lugar_id, nombre, tipo_cocina, direccion, telefono, precio_promedio } = req.body;
    const result = await pool.query(
      `INSERT INTO locales_comida (lugar_id, nombre, tipo_cocina, direccion, telefono, precio_promedio)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [lugar_id, nombre, tipo_cocina, direccion, telefono, precio_promedio]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CÓDIGOS DE CONDUCTA
app.get('/api/conducta/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM codigos_conducta WHERE lugar_id = $1', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/conducta', async (req, res) => {
  try {
    const { lugar_id, regla } = req.body;
    const result = await pool.query(
      `INSERT INTO codigos_conducta (lugar_id, regla) VALUES ($1,$2) RETURNING *`,
      [lugar_id, regla]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ RESEÑAS
app.get('/api/resenas/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resenas WHERE lugar_id = $1 ORDER BY creado_en DESC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resenas', async (req, res) => {
  try {
    const { lugar_id, usuario, comentario, estrellas } = req.body;
    const result = await pool.query(
      `INSERT INTO resenas (lugar_id, usuario, comentario, estrellas)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [lugar_id, usuario, comentario, estrellas]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NODOS
app.get('/api/nodos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nodos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ESTADO DE REPLICACIÓN
app.get('/api/replicacion/estado', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        client_addr AS ip_replica,
        state,
        (sent_lsn - replay_lsn) AS bytes_pendientes
      FROM pg_stat_replication;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Nodo Guadalupe corriendo en puerto ${process.env.PORT}`);
});