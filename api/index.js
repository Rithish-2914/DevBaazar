const express = require('express');
const path = require('path');
const fs = require('fs');

let app = null;
let initialized = false;

async function initializeApp() {
  if (initialized) return app;

  app = express();

  app.use(express.json({ 
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }));
  app.use(express.urlencoded({ extended: false }));

  // Load the bundled server
  try {
    const serverPath = path.resolve(__dirname, '../dist/index.cjs');
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server bundle not found at ${serverPath}`);
    }
    
    const serverModule = require(serverPath);
    // The bundled server should export setup logic
    // For now, we'll manually set up routes
    
    const { registerRoutes } = await import('../server/routes.js');
    const { serveStatic } = await import('../server/static.js');
    
    await registerRoutes(null, app);
    serveStatic(app);
  } catch (error) {
    console.error('Failed to initialize routes:', error);
    app.get('*', (req, res) => {
      res.status(500).json({ error: 'Server initialization failed', details: error.message });
    });
  }

  initialized = true;
  return app;
}

module.exports = async (req, res) => {
  try {
    const application = await initializeApp();
    return application(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
