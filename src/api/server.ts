/**
 * SAMADHAN — Unified Production Server Entry Point
 * Serves Express API and compiled Vite static frontend from a single Node process.
 * Configured for Render deployment with 0.0.0.0 host binding and process.env.PORT support.
 */

import { app } from './app';
import { getServerCpgramsService } from './serviceInit';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// Initialize data service before listening
try {
  const service = getServerCpgramsService();
  const overview = service.getSystemOverview();
  console.log(`[SAMADHAN PRODUCTION SERVER] Initialized with ${overview.entities} entities and ${overview.received.toLocaleString('en-IN')} live grievances.`);

  app.listen(PORT, HOST, () => {
    console.log(`[SAMADHAN PRODUCTION SERVER] Listening on http://${HOST}:${PORT}`);
    console.log(`[SAMADHAN PRODUCTION SERVER] Health check: http://${HOST}:${PORT}/api/health`);
  });
} catch (error) {
  console.error('[SAMADHAN PRODUCTION SERVER] Initialization failed:', error);
  process.exit(1);
}
