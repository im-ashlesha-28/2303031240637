export const logEvent = (type, action, data = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${type}] ${action}`, data);
  }
};
