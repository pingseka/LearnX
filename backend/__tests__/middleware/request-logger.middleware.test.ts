import express from 'express';
import request from 'supertest';
import { requestLoggerMiddleware } from '../../src/middleware/request-logger.middleware';
import { getMetrics, resetMetrics } from '../../src/services/metrics.service';
import { logger } from '../../src/utils/logger';

describe('requestLoggerMiddleware', () => {
  beforeEach(() => {
    resetMetrics();
    jest.spyOn(logger, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds a request id and records completed requests', async () => {
    const app = express();
    app.use(requestLoggerMiddleware);
    app.get('/example', (req, res) => {
      res.status(200).json({ ok: true });
    });

    const response = await request(app).get('/example');

    expect(response.headers['x-request-id']).toBeTruthy();
    expect(getMetrics().requests.total).toBe(1);
    expect(logger.info).toHaveBeenCalledWith(
      'http_request',
      expect.objectContaining({
        method: 'GET',
        path: '/example',
        statusCode: 200,
      })
    );
  });
});
