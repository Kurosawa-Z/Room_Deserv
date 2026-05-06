import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './env.js';
import { healthcheckDb } from './db.js';
import {
  clearAuthCookie,
  findUserByUsername,
  createUser,
  issueLogin,
  getTokenFromRequest,
  sanitizeUser,
  verifyPasswordAndMaybeUpgrade,
  verifyToken
} from './auth.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl/Postman) with no Origin header.
      if (!origin) return callback(null, true);

      if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', async (_req, res) => {
  try {
    const dbOk = await healthcheckDb();
    res.json({ ok: true, dbOk });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message ?? 'healthcheck_failed' });
  }
});

app.post('/auth/signup', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body ?? {};

    if (typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ error: 'username_required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'password_too_short' });
    }

    const existing = await findUserByUsername(username.trim());
    if (existing) {
      return res.status(409).json({ error: 'username_taken' });
    }

    await createUser({ username: username.trim(), password });
    const user = await findUserByUsername(username.trim());

    issueLogin(res, { userId: user.id ?? user.username, username: user.username, rememberMe: !!rememberMe });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? 'signup_failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body ?? {};

    if (typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'username_required' });
    }
    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'password_required' });
    }

    const user = await findUserByUsername(username.trim());
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const ok = await verifyPasswordAndMaybeUpgrade({
      userId: user.id,
      username: user.username,
      inputPassword: password,
      storedPassword: user.password
    });

    if (!ok) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    issueLogin(res, { userId: user.id ?? user.username, username: user.username, rememberMe: !!rememberMe });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? 'login_failed' });
  }
});

app.post('/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get('/auth/me', (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ error: 'unauthorized' });

    const payload = verifyToken(token);
    res.json({ user: { id: payload.sub, username: payload.username } });
  } catch (_err) {
    res.status(401).json({ error: 'unauthorized' });
  }
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
