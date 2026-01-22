import express from 'express';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// Este es tu link corregido con la contraseña moto2026
const mongoURI = "mongodb+srv://erick_toluca:moto2026@cluster0.bsulozi.mongodb.net/reportes?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado exitosamente a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

const reporteSchema = new mongoose.Schema({
  texto: String,
  fecha: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now, expires: 10800 } // Los reportes duran 3 horas
});

const Reporte = mongoose.model('Reporte', reporteSchema);

app.get('/', async (req, res) => {
  const html = await readFile('./index.html', 'utf-8');
  res.send(html);
});

app.get('/api/chat', async (req, res) => {
  try {
    const puntos = await Reporte.find();
    res.json(puntos);
  } catch (e) { res.status(500).json([]); }
});

app.post('/api/chat', async (req, res) => {
  try {
    const nuevo = new Reporte(req.body);
    await nuevo.save();
    res.json({ status: "ok" });
  } catch (e) { res.status(500).json({ error: "error" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
