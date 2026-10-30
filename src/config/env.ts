const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set');
}

export const env = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
