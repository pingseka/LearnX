import express from 'express';
import request from 'supertest';
import { sequelize } from '../../src/config/database';
import { env } from '../../src/config/env';
import monitoringRoutes from '../../src/routes/monitoring.routes';
import { logger } from '../../src/utils/logger';

describe('monitoring routes', () => {
  const app = express();
  const originalMonitoringToken = env.MONITORING_TOKEN;

  app.use(monitoringRoutes);

  afterEach(() => {
    env.MONITORING_TOKEN = originalMonitoringToken;
    jest.restoreAllMocks();
  });

  it('returns healthy when the database is reachable', async () => {
    jest.spyOn(sequelize, 'authenticate').mockResolvedValue();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'healthy',
        database: 'healthy',
      })
    );
  });

  it('returns unhealthy when the database is unreachable', async () => {
    jest
      .spyOn(sequelize, 'authenticate')
      .mockRejectedValue(new Error('database unavailable'));
    jest.spyOn(logger, 'error').mockImplementation(() => undefined);

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'unhealthy',
        database: 'unhealthy',
      })
    );
  });

  it('protects metrics with a bearer token', async () => {
    env.MONITORING_TOKEN = 'monitoring-test-token';

    const unauthorized = await request(app).get('/metrics');
    const authorized = await request(app)
      .get('/metrics')
      .set('Authorization', 'Bearer monitoring-test-token');

    expect(unauthorized.status).toBe(401);
    expect(authorized.status).toBe(200);
  });
});
