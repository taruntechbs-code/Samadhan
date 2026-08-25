/**
 * SAMADHAN — Backend API Server Entry Point
 */

import { app } from './app';
import { getServerCpgramsService } from './serviceInit';

const PORT = process.env.PORT || 5000;

// Initialize data service before listening
try {
  const service = getServerCpgramsService();
  const overview = service.getSystemOverview();
  console.log(`[SAMADHAN API] Initialized with ${overview.entities} entities and ${overview.received.toLocaleString('en-IN')} live grievances.`);

  app.listen(PORT, () => {
    console.log(`[SAMADHAN API] Server running at http://localhost:${PORT}`);
    console.log(`[SAMADHAN API] Health check: http://localhost:${PORT}/api/health`);
  });
} catch (error) {
  console.error('[SAMADHAN API] Initialization failed:', error);
  process.exit(1);
}
