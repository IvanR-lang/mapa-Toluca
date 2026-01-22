import express from 'express';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import cron from 'node-cron';

const app = express();
app.use(express.json());

// Tu link de conexión a MongoDB Atlas
const mongoURI = "mongodb+srv://erick_toluca:moto2026@cluster0.bsulozi.mongodb.net/reportes?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connect(mongoURI).then(() => console.log("✅ Conectado a MongoDB"));

const reporteSchema = new mongoose.Schema({
  texto: String,
  fecha: String,
  lat: Number,
  lng: Number
});

const Reporte = mongoose.model('Reporte', reporteSchema);

// 1. TAREA AUTOMÁTICA: Borrado a las 23:59 (Hora Toluca)
cron.schedule('59 23 * * *', async () => {
    console.log('🧹 Limpieza programada finalizada.');
    await Reporte.deleteMany({});
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

// 2. RUTA SECRETA: Borrado manual solo para ti
app.get('/borrado-manual-secreto-iza', async (req, res) => {
    try {
        await Reporte.deleteMany({});
        res.send(`
            <div style="text-align:center; padding:50px; font-family:sans-serif; background:#000; color:white; height:100vh; display:flex; flex-direction:column; justify-content:center;">
                <h1 style="color:#e63946;">🧹 SISTEMA VIGÍA LIMPIADO</h1>
                <p>Todos los reportes han sido eliminados de la base de datos.</p>
                <a href="/" style="color:#00d4ff; text-decoration:none; font-weight:bold; border:1px solid #00d4ff; padding:10px 20px; border-radius:10px; width:fit-content; margin: 20px auto;">Volver al Mapa</a>
            </div>
        `);
    } catch (error) {
        res.status(500).send("Error en la limpieza");
    }
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
app.listen(PORT, () => console.log(`🚀 Vigía Toluca en puerto ${PORT}`));
