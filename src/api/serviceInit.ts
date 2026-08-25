/**
 * SAMADHAN — Backend API Service Initializer
 * Loads the real CSV dataset and initializes the intelligence service singleton.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseCpgramsCsv } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from '../services/cpgramsService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let globalService: CpgramsService | null = null;

export function getServerCpgramsService(): CpgramsService {
  if (globalService) {
    return globalService;
  }

  const possiblePaths = [
    path.resolve(process.cwd(), '10_MASTER_verified_cpgrams_metrics_long.csv'),
    path.resolve(process.cwd(), 'public', '10_MASTER_verified_cpgrams_metrics_long.csv'),
    path.resolve(__dirname, '../../10_MASTER_verified_cpgrams_metrics_long.csv'),
    path.resolve(__dirname, '../../../10_MASTER_verified_cpgrams_metrics_long.csv'),
  ];

  let csvPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    throw new Error('Master CSV file 10_MASTER_verified_cpgrams_metrics_long.csv could not be found.');
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const parseResult = parseCpgramsCsv(csvContent);
  
  if (parseResult.validRowCount === 0) {
    throw new Error('Failed to parse rows from CPGRAMS dataset.');
  }

  globalService = initializeCpgramsService(parseResult.normalizedRows);
  return globalService;
}
