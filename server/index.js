import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

import { notFoundHandler, errorHandler } from './middlewares/error.middlewares.js';
import { connectDB } from './database/connectDB.js';

import instrutorRoutes from './routes/instrutor.routes.js';
import estudanteRoutes from './routes/estudante.routes.js';
import cursoRoutes from './routes/curso.routes.js';
import videoRoutes from './routes/video.routes.js';
import comentarioRoutes from './routes/comentario.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cors({
  origin: 'http://localhost:3000', // substitua isso pela URL do seu cliente React
  credentials: true
}));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/estudantes', estudanteRoutes);
app.use('/api/instrutores', instrutorRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comentarios', comentarioRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Servidor rodando da na porta http://localhost:${process.env.PORT} 🐧`);
});