import 'dotenv/config';

function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Missing required env var: ${name}`);
  if (value.trim().length === 0) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),

  // Prefer CORS_ORIGINS (comma-separated). Kept CORS_ORIGIN for backward compatibility.
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: requireEnv('DB_USER'),
  // Empty passwords are valid in some local dev setups (e.g., XAMPP).
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_NAME: requireEnv('DB_NAME'),

  DB_USER_TABLE: process.env.DB_USER_TABLE ?? 'users',
  DB_USER_ID_COL: process.env.DB_USER_ID_COL ?? 'id',
  DB_USER_USERNAME_COL: process.env.DB_USER_USERNAME_COL ?? 'username',
  DB_USER_PASSWORD_COL: process.env.DB_USER_PASSWORD_COL ?? 'password',

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  COOKIE_NAME: process.env.COOKIE_NAME ?? 'rd_token',

  // If your existing DB stores plaintext passwords (not recommended), you can temporarily enable this.
  // When enabled, a successful plaintext login will be upgraded to a bcrypt hash in the DB.
  ALLOW_LEGACY_PLAINTEXT_PASSWORDS: process.env.ALLOW_LEGACY_PLAINTEXT_PASSWORDS === 'true'
};
