/**
 * SAMADHAN — Robust CSV Parser & Loader for CPGRAMS Real Aggregate Dataset
 * Compatible with Browser (fetch) and Node.js environments.
 */

import {
  NormalizedMetricRow,
  CsvLoadResult,
  CORE_METRICS,
} from './types';

export const CSV_PUBLIC_PATH = '/10_MASTER_verified_cpgrams_metrics_long.csv';

const REQUIRED_HEADERS = [
  'dataset',
  'scope',
  'entity',
  'period_start',
  'period_end',
  'metric',
  'value',
];

/**
 * Splits a CSV text into array of rows, where each row is an array of cell values.
 * Correctly accounts for quotes and commas/escapes within quoted cells.
 */
export function tokenizeCsv(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote ("")
        currentCell += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Cell boundary
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !insideQuotes) {
      // Row boundary
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // Final cell and row if any remaining
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Validates date string in YYYY-MM-DD, YYYY-MM, YYYY, or allows empty for snapshots.
 */
export function isValidDateOrSnapshot(dateStr: string): boolean {
  if (!dateStr || dateStr.trim() === '') return true; // Allowed for snapshot dates or year-level
  const trimmed = dateStr.trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    return !isNaN(d.getTime());
  }
  // YYYY-MM
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return true;
  }
  // YYYY
  if (/^\d{4}$/.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Parses raw CSV string into strongly-typed normalized rows.
 */
export function parseCpgramsCsv(csvContent: string): CsvLoadResult {
  const tokenized = tokenizeCsv(csvContent);
  const errors: string[] = [];
  const normalizedRows: NormalizedMetricRow[] = [];

  if (tokenized.length === 0) {
    return {
      rawRowCount: 0,
      validRowCount: 0,
      skippedRowCount: 0,
      errors: ['CSV content is empty.'],
      normalizedRows: [],
    };
  }

  const headerRow = tokenized[0].map(h => h.toLowerCase().trim());
  
  // Validate required headers
  const missingHeaders = REQUIRED_HEADERS.filter(rh => !headerRow.includes(rh));
  if (missingHeaders.length > 0) {
    const errorMsg = `CSV is missing required headers: ${missingHeaders.join(', ')}`;
    return {
      rawRowCount: tokenized.length - 1,
      validRowCount: 0,
      skippedRowCount: tokenized.length - 1,
      errors: [errorMsg],
      normalizedRows: [],
    };
  }

  const headerMap: Record<string, number> = {};
  headerRow.forEach((h, idx) => {
    headerMap[h] = idx;
  });

  const getCell = (row: string[], colName: string): string => {
    const idx = headerMap[colName];
    return idx !== undefined && idx < row.length ? row[idx] : '';
  };

  let skippedCount = 0;

  for (let rowIndex = 1; rowIndex < tokenized.length; rowIndex++) {
    const row = tokenized[rowIndex];
    const lineNum = rowIndex + 1;

    const dataset = getCell(row, 'dataset');
    const scope = getCell(row, 'scope');
    const entity = getCell(row, 'entity');
    const periodStart = getCell(row, 'period_start');
    const periodEnd = getCell(row, 'period_end');
    const metric = getCell(row, 'metric');
    const valueStr = getCell(row, 'value');
    const unit = getCell(row, 'unit');
    const sourceUrl = getCell(row, 'source_url');
    const sourceNote = getCell(row, 'source_note');

    // Validation checks
    if (!entity) {
      errors.push(`Row ${lineNum}: Missing entity name.`);
      skippedCount++;
      continue;
    }

    if (!isValidDateOrSnapshot(periodStart) || !isValidDateOrSnapshot(periodEnd)) {
      errors.push(`Row ${lineNum}: Invalid period dates ("${periodStart}" to "${periodEnd}") for entity "${entity}".`);
      skippedCount++;
      continue;
    }

    if (!metric) {
      errors.push(`Row ${lineNum}: Missing metric name for entity "${entity}".`);
      skippedCount++;
      continue;
    }

    const numValue = Number(valueStr);
    if (valueStr === '' || isNaN(numValue)) {
      errors.push(`Row ${lineNum}: Invalid numeric value "${valueStr}" for metric "${metric}" on entity "${entity}".`);
      skippedCount++;
      continue;
    }

    const normalizedMetric = metric.toLowerCase().trim();
    const isCore = (CORE_METRICS as readonly string[]).includes(normalizedMetric);

    // Compute robust periodKey
    let periodKey: string;
    if (periodStart && periodEnd) {
      periodKey = `${periodStart}_${periodEnd}`;
    } else if (periodEnd) {
      periodKey = `as_of_${periodEnd}`;
    } else if (periodStart) {
      periodKey = `from_${periodStart}`;
    } else {
      periodKey = dataset;
    }

    normalizedRows.push({
      dataset: dataset || 'cpgrams_default',
      scope: scope || 'Department',
      entity,
      periodStart,
      periodEnd,
      periodKey,
      metric: normalizedMetric,
      isCoreMetric: isCore,
      value: numValue,
      unit: unit || (normalizedMetric.includes('percent') ? 'percent' : 'count'),
      sourceUrl,
      sourceNote,
    });
  }

  return {
    rawRowCount: tokenized.length - 1,
    validRowCount: normalizedRows.length,
    skippedRowCount: skippedCount,
    errors,
    normalizedRows,
  };
}

/**
 * Loads and parses the CPGRAMS CSV in a browser environment via fetch.
 */
export async function loadCpgramsDataset(url: string = CSV_PUBLIC_PATH): Promise<CsvLoadResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CPGRAMS dataset from "${url}": HTTP ${response.status} ${response.statusText}`);
  }
  const csvText = await response.text();
  return parseCpgramsCsv(csvText);
}
