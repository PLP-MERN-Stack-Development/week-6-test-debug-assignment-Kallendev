const logLevel = import.meta.env.MODE === 'development' ? 'debug' : 'info';

const logger = {
  info: (message, meta = {}) => {
    if (logLevel === 'debug' || logLevel === 'info') {
      console.info(`[INFO] ${message}`, meta);
    }
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  },
  debug: (message, meta = {}) => {
    if (logLevel === 'debug') {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  },
};

export { logger };