import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const uri = process.env.DB_ATLAS;
const db = mongoose.connection;

// evita el warning de strictQuery
mongoose.set('strictQuery', false);

mongoose.connect(uri).catch((err) => {
  console.error('MongoDB connection error');
  console.error(err?.message || err);
});

db.once('open', () => {
  console.log('Base de datos conectada correctamente');
});

db.on('error', (err) => {
  console.error(`Error de conexión a MongoDB: ${err?.message || err}`);
});