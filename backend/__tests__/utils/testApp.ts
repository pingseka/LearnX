import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import corsMiddleware from '../../src/config/cors';
import { errorMiddleware } from '../../src/middleware/error.middleware';
import authRoutes from '../../src/routes/auth.routes';
import materialsRoutes from '../../src/routes/materials.routes';
import ordersRoutes from '../../src/routes/orders.routes';
import earningsRoutes from '../../src/routes/earnings.routes';
import aiRoutes from '../../src/routes/ai.routes';

const app = express();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorMiddleware);

export default app;