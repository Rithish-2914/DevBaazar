import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import { storage } from '../server/storage.js';
import { api } from '../shared/routes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: false }));

const memoryStore = new (MemoryStore(session))();
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-bazaar-secret',
  resave: false,
  saveUninitialized: false,
  store: memoryStore,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
  next();
};

app.post(api.auth.register.path, async (req, res) => {
  try {
    const input = api.auth.register.input.parse(req.body);
    const existingUser = await storage.getUserByUsername(input.username);
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    const user = await storage.createUser(input);
    req.session.userId = user.id;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post(api.auth.login.path, async (req, res) => {
  try {
    const input = api.auth.login.input.parse(req.body);
    const user = await storage.getUserByUsername(input.username);
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    req.session.userId = user.id;
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post(api.auth.logout.path, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

app.get(api.auth.me.path, (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
  res.json({ userId: req.session.userId });
});

const publicPath = path.resolve(__dirname, '../dist/public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, { maxAge: '1d', etag: false }));
  app.use((_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(path.resolve(publicPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.json({ message: 'Build frontend first' }));
}

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

export default app;
