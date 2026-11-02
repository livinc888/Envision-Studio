import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { connectDB } from './db/database.js';
import { seedData } from './db/seed.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await connectDB();
    // Auto-seed if database is empty on boot
    await seedData(false);
  } catch (err) {
    console.warn('[Server Boot] Seed skipped or encountered non-fatal error:', err);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[EnvisionStudio Server] Running on http://127.0.0.1:${PORT}`);
    console.log(`[API Ready] Endpoints available at http://127.0.0.1:${PORT}/api`);
  });
}

bootstrap();
