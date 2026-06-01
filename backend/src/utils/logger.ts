type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
};
const writeLog = (
  level: LogLevel,
  message: string,
  context: LogContext = {}
) => {
  const output = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: 'learnx-backend',
    environment: process.env.NODE_ENV || 'development',
    message,
    ...context,
  });

  if (level === 'error') {
    console.error(output);
    return;
  }

  if (level === 'warn') {
    console.warn(output);
    return;
  }

  console.log(output);
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      writeLog('debug', message, context);
    }
  },
  info: (message: string, context?: LogContext) => {
    writeLog('info', message, context);
  },
  warn: (message: string, context?: LogContext) => {
    writeLog('warn', message, context);
  },
  error: (message: string, error?: unknown, context?: LogContext) => {
    writeLog('error', message, {
      ...context,
      ...(error === undefined ? {} : { error: serializeError(error) }),
    });
  },
};
