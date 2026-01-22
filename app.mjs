import express from 'express';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import cron from 'node-cron';

const app = express();
app.use(express.json());

const mongoURI = "mongodb+srv://erick_toluca:moto2026@cluster0.bsulozi.mongodb.net/reportes?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connect(mongoURI).then(() => console.log("✅ Conectado a MongoDB"));

const reporteSchema = new mongoose.Schema({
  texto: String,
  fecha: String,
  lat: Number,
  lng: Number
});

const Reporte = mongoose.model('Reporte', reporteSchema);

// BORRADO EXACTO A LAS 23:59
cron.schedule('59 23 * * *', async () => {
    console.log('🧹 Borrando reportes del día...');
    await Reporte.deleteMany({});
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

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

app.delete('/api/chat/:id', async (req, res) => {
  await Reporte.findByIdAndDelete(req.params.id);
  res.json({ status: "borrado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
