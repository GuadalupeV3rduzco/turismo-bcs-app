const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'bcs_turismo_secret_2026';

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

// ✅ CATEGORIAS
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LUGARES
app.get('/api/lugares', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, r.nombre as region, c.nombre as categoria
      FROM lugares l
      JOIN regiones r ON l.region_id = r.id
      LEFT JOIN categorias c ON l.categoria_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lugares/region/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, c.nombre as categoria
      FROM lugares l
      LEFT JOIN categorias c ON l.categoria_id = c.id
      WHERE l.region_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lugares/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, r.nombre as region, c.nombre as categoria
      FROM lugares l
      JOIN regiones r ON l.region_id = r.id
      LEFT JOIN categorias c ON l.categoria_id = c.id
      WHERE l.id = $1
    `, [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lugares', async (req, res) => {
  try {
    const { region_id, nombre, descripcion, latitud, longitud, categoria_id, imagen_url } = req.body;
    const result = await pool.query(
      `INSERT INTO lugares (region_id, nombre, descripcion, latitud, longitud, categoria_id, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [region_id, nombre, descripcion, latitud, longitud, categoria_id, imagen_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ACTIVIDADES
app.get('/api/actividades/region/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.nombre as categoria
      FROM actividades a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      WHERE a.region_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/actividades/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.nombre as categoria
      FROM actividades a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      WHERE a.lugar_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/actividades', async (req, res) => {
  try {
    const { region_id, lugar_id, nombre, descripcion, duracion, dificultad, categoria_id, imagen_url } = req.body;
    const result = await pool.query(
      `INSERT INTO actividades (region_id, lugar_id, nombre, descripcion, duracion, dificultad, categoria_id, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [region_id, lugar_id, nombre, descripcion, duracion, dificultad, categoria_id, imagen_url]
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
      `INSERT INTO fotos (lugar_id, url, descripcion) VALUES ($1,$2,$3) RETURNING *`,
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
app.get('/api/resenas/region/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.nombre_usuario, u.foto_url as usuario_foto
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.lugar_id IN (
        SELECT id FROM lugares WHERE region_id = $1
      )
      ORDER BY r.creado_en DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resenas/lugar/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.nombre_usuario, u.foto_url as usuario_foto
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.lugar_id = $1
      ORDER BY r.creado_en DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resenas', async (req, res) => {
  try {
    const { lugar_id, usuario_id, titulo, comentario, estrellas } = req.body;
    const result = await pool.query(
      `INSERT INTO resenas (lugar_id, usuario_id, titulo, comentario, estrellas)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [lugar_id, usuario_id, titulo, comentario, estrellas]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ AUTENTICACIÓN
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre_usuario, correo, contrasena } = req.body;

    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1 OR nombre_usuario = $2',
      [correo, nombre_usuario]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo o nombre de usuario ya está en uso' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre_usuario, correo, contrasena_hash)
       VALUES ($1, $2, $3) RETURNING id, nombre_usuario, correo, foto_url`,
      [nombre_usuario, correo, hash]
    );

    const usuario = result.rows[0];
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ usuario, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1', [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!valido) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        foto_url: usuario.foto_url,
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/perfil', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, nombre_usuario, correo, foto_url, creado_en FROM usuarios WHERE id = $1',
      [decoded.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

app.put('/api/auth/perfil', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { nombre_usuario, correo, foto_url } = req.body;

    const result = await pool.query(
      `UPDATE usuarios SET 
        nombre_usuario = COALESCE($1, nombre_usuario),
        correo = COALESCE($2, correo),
        foto_url = COALESCE($3, foto_url),
        actualizado_en = NOW()
       WHERE id = $4 RETURNING id, nombre_usuario, correo, foto_url`,
      [nombre_usuario, correo, foto_url, decoded.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/contrasena', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { contrasena_actual, contrasena_nueva } = req.body;

    const result = await pool.query(
      'SELECT contrasena_hash FROM usuarios WHERE id = $1', [decoded.id]
    );

    const valido = await bcrypt.compare(contrasena_actual, result.rows[0].contrasena_hash);
    if (!valido) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const hash = await bcrypt.hash(contrasena_nueva, 10);
    await pool.query(
      'UPDATE usuarios SET contrasena_hash = $1 WHERE id = $2', [hash, decoded.id]
    );
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
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