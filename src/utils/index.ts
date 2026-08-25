/**
 * SAMADHAN — Utility Functions
 */

export function formatMetricNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}
