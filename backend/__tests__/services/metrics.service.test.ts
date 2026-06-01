import {
  getMetrics,
  recordRequest,
  resetMetrics,
} from '../../src/services/metrics.service';

describe('metrics service', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('starts with empty request metrics', () => {
    expect(getMetrics().requests).toEqual({
      total: 0,
      failed: 0,
      errorRate: 0,
      averageResponseTimeMs: 0,
    });
  });

  it('records request count, response time and server error rate', () => {
    recordRequest(200, 20);
    recordRequest(404, 40);
    recordRequest(500, 60);

    expect(getMetrics().requests).toEqual({
      total: 3,
      failed: 1,
      errorRate: 0.33,
      averageResponseTimeMs: 40,
    });
  });
});
