import express from 'express';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// REEMPLAZA ESTE LINK con el que copies de "Connect -> Drivers" en MongoDB
// No olvides poner tu usuario y tu contraseña real
const mongoURI = "mongodb+srv://erick_toluca:moto2026@cluster0.mongodb.net/reportes?retryWrites=true&w=majority"; 

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

const reporteSchema = new mongoose.Schema({
  texto: String,
  fecha: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now, expires: 10800 } // Borra tras 3 horas
});

const Reporte = mongoose.model('Reporte', reporteSchema);

app.get('/', async (req, res) => {
  const html = await readFile('./index.html', 'utf-8');
  res.send(html);
});

app.get('/api/chat', async (req, res) => {
  const puntos = await Reporte.find();
  res.json(puntos);
});

app.post('/api/chat', async (req, res) => {
  const nuevo = new Reporte(req.body);
  await nuevo.save();
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor funcionando en el puerto ${PORT}`));
