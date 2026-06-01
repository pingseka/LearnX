interface MetricsState {
  startedAt: Date;
  totalRequests: number;
  failedRequests: number;
  totalDurationMs: number;
}

const state: MetricsState = {
  startedAt: new Date(),
  totalRequests: 0,
  failedRequests: 0,
  totalDurationMs: 0,
};
const round = (value: number) => Math.round(value * 100) / 100;

export const recordRequest = (statusCode: number, durationMs: number) => {
  state.totalRequests += 1;
  state.totalDurationMs += durationMs;

  if (statusCode >= 500) {
    state.failedRequests += 1;
  }
};

export const getMetrics = () => {
  const averageResponseTimeMs =
    state.totalRequests === 0
      ? 0
      : state.totalDurationMs / state.totalRequests;
  const errorRate =
    state.totalRequests === 0
      ? 0
      : state.failedRequests / state.totalRequests;

  return {
    startedAt: state.startedAt.toISOString(),
    uptimeSeconds: round(process.uptime()),
    requests: {
      total: state.totalRequests,
      failed: state.failedRequests,
      errorRate: round(errorRate),
      averageResponseTimeMs: round(averageResponseTimeMs),
    },
  };
};

export const resetMetrics = () => {
  state.startedAt = new Date();
  state.totalRequests = 0;
  state.failedRequests = 0;
  state.totalDurationMs = 0;
};
