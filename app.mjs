// app.mjs
import express from 'express';
import { readFile, writeFile } from 'node:fs/promises'; // Importamos 'writeFile' para poder guardar
import { existsSync } from 'node:fs'; // Para comprobar si el archivo ya existe

const app = express();
app.use(express.json());

const ARCHIVO_DB = './mensajes.json'; // Este será nuestro archivo "Base de Datos"

// --- FUNCIÓN 1: Cargar mensajes al iniciar ---
// Esta función busca si existe el archivo de mensajes y lo lee
async function cargarMensajesGuardados() {
  try {
    if (existsSync(ARCHIVO_DB)) {
      const datos = await readFile(ARCHIVO_DB, 'utf-8');
      return JSON.parse(datos); // Convertimos el texto del archivo a Array
    }
  } catch (error) {
    console.log('No había mensajes guardados, empezamos desde cero.');
  }
  return []; // Si no hay archivo, devolvemos una lista vacía
}

// Inicializamos la lista leyendo el archivo
// (Ojo: usamos 'let' porque la lista va a cambiar)
let listaMensajes = await cargarMensajesGuardados();

// RUTA 1: Inicio
app.get('/', async (req, res) => {
  try {
    const html = await readFile('./index.html', 'utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error leyendo el archivo');
  }
});

// RUTA 2: Ver mensajes (API)
app.get('/api/chat', (req, res) => {
  res.json(listaMensajes);
});

// RUTA 3: Guardar mensaje (API)
app.post('/api/chat', async (req, res) => {
  // Ahora recibimos un objeto completo: { texto, lat, lng }
  const nuevoPunto = req.body; 
  
  listaMensajes.push(nuevoPunto);
  await writeFile(ARCHIVO_DB, JSON.stringify(listaMensajes));

  res.json({ todosLosMensajes: listaMensajes });
});
// Esto permite que la nube elija el puerto automáticamente
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});