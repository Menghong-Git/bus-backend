export const JWT_CONSTANTS = {
  secret:
    process.env.JWT_SECRET ||
    'your-super-secret-key-change-in-production-1234567890',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    'your-refresh-super-secret-key-change-in-production-987654321',
  expiresIn: '1h', // Use string literal instead of process.env for type safety
  refreshExpiresIn: '7d', // Use string literal instead of process.env for type safety
};
