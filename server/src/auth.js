import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { pool } from './db.js';

function isProbablyBcryptHash(value) {
  return typeof value === 'string' && value.startsWith('$2');
}

function signToken(payload, rememberMe) {
  // If rememberMe is false, keep a shorter cookie lifetime.
  const expiresIn = rememberMe ? env.JWT_EXPIRES_IN : '1d';
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function setAuthCookie(res, token, rememberMe) {
  const isProd = env.NODE_ENV === 'production';

  // MaxAge is optional: when not set, cookie becomes a session cookie.
  // For "remember me" we set a longer maxAge.
  const maxAgeMs = rememberMe ? 1000 * 60 * 60 * 24 * 7 : undefined;

  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    ...(maxAgeMs ? { maxAge: maxAgeMs } : {})
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(env.COOKIE_NAME, { path: '/' });
}

export function getTokenFromRequest(req) {
  return req.cookies?.[env.COOKIE_NAME] ?? null;
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export async function findUserByUsername(username) {
  const table = env.DB_USER_TABLE;
  const idCol = env.DB_USER_ID_COL;
  const usernameCol = env.DB_USER_USERNAME_COL;
  const passwordCol = env.DB_USER_PASSWORD_COL;

  const sql = `SELECT \`${idCol}\` as id, \`${usernameCol}\` as username, \`${passwordCol}\` as password FROM \`${table}\` WHERE \`${usernameCol}\` = ? LIMIT 1`;
  const [rows] = await pool.query(sql, [username]);
  return rows?.[0] ?? null;
}

export async function createUser({ username, password }) {
  const table = env.DB_USER_TABLE;
  const usernameCol = env.DB_USER_USERNAME_COL;
  const passwordCol = env.DB_USER_PASSWORD_COL;

  const passwordHash = await bcrypt.hash(password, 12);
  const sql = `INSERT INTO \`${table}\` (\`${usernameCol}\`, \`${passwordCol}\`) VALUES (?, ?)`;
  const [result] = await pool.query(sql, [username, passwordHash]);
  return result;
}

export async function verifyPasswordAndMaybeUpgrade({ userId, username, inputPassword, storedPassword }) {
  if (typeof storedPassword !== 'string' || storedPassword.length === 0) return false;

  if (isProbablyBcryptHash(storedPassword)) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  if (!env.ALLOW_LEGACY_PLAINTEXT_PASSWORDS) return false;

  // Legacy plaintext support (temporary) + upgrade on success.
  const ok = inputPassword === storedPassword;
  if (!ok) return false;

  const table = env.DB_USER_TABLE;
  const idCol = env.DB_USER_ID_COL;
  const passwordCol = env.DB_USER_PASSWORD_COL;
  const newHash = await bcrypt.hash(inputPassword, 12);
  const sql = `UPDATE \`${table}\` SET \`${passwordCol}\` = ? WHERE \`${idCol}\` = ? LIMIT 1`;
  await pool.query(sql, [newHash, userId]);

  return true;
}

export function sanitizeUser(userRow) {
  if (!userRow) return null;
  // Some schemas may have nullable/non-auto-increment ids during early setup.
  // Fall back to username so sessions still work.
  return { id: userRow.id ?? userRow.username, username: userRow.username };
}

export function issueLogin(res, { userId, username, rememberMe }) {
  const token = signToken({ sub: String(userId), username }, rememberMe);
  setAuthCookie(res, token, rememberMe);
  return token;
}
