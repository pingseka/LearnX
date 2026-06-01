import { timingSafeEqual } from 'crypto';
import { Router } from 'express';
import { sequelize } from '../config/database';
import { env } from '../config/env';
import { getMetrics } from '../services/metrics.service';
import { logger } from '../utils/logger';

const router = Router();

const hasValidMonitoringToken = (authorization?: string) => {
  if (!env.MONITORING_TOKEN) {
    return env.NODE_ENV !== 'production';
  }

  const token = authorization?.replace(/^Bearer\s+/i, '') || '';
  const expected = Buffer.from(env.MONITORING_TOKEN);
  const actual = Buffer.from(token);

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
};

router.get('/health', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    await sequelize.authenticate();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: env.APP_VERSION,
      uptimeSeconds: Math.round(process.uptime() * 100) / 100,
      database: 'healthy',
    });
  } catch (error) {
    logger.error('health_check_failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: env.APP_VERSION,
      database: 'unhealthy',
    });
  }
});

router.get('/metrics', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (!hasValidMonitoringToken(req.header('authorization'))) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
    return;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    metrics: getMetrics(),
  });
});

export default router;
