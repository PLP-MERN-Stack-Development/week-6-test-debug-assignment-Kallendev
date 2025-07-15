const logger = {
  info: (message, metadata) => {
    console.log(`[INFO] ${message}`, metadata || {});
  },
  error: (message, metadata) => {
    console.error(`[ERROR] ${message}`, metadata || {});
  },
};

export default logger;