export type PreparationLanguage = 'en' | 'hi';

export interface PrepareGrievanceInput {
  grievance: string;
  detectedCategory: string;
  language: PreparationLanguage;
}

export interface PreparedGrievance {
  subject: string;
  grievance: string;
}

export const OFFICIAL_CPGRAMS_URL = 'https://pgportal.gov.in';

/** Normalize formatting without changing, translating, or supplementing citizen facts. */
export function normalizeGrievanceWhitespace(value: string): string {
  return value.replace(/\s+/gu, ' ').trim();
}

/** Build a stable CPGRAMS draft using only the complaint and detected category. */
export function prepareGrievance({
  grievance,
  detectedCategory,
  language,
}: PrepareGrievanceInput): PreparedGrievance {
  const normalizedGrievance = normalizeGrievanceWhitespace(grievance);
  const normalizedCategory = normalizeGrievanceWhitespace(detectedCategory);

  return {
    subject: language === 'hi'
      ? `${normalizedCategory} से संबंधित शिकायत`
      : `Grievance regarding ${normalizedCategory}`,
    grievance: normalizedGrievance,
  };
}

export function formatPreparedGrievance(subject: string, grievance: string): string {
  return `${subject.trim()}\n\n${grievance.trim()}`;
}

export async function copyPreparedGrievance(
  subject: string,
  grievance: string,
  clipboard: Pick<Clipboard, 'writeText'> = navigator.clipboard,
): Promise<void> {
  await clipboard.writeText(formatPreparedGrievance(subject, grievance));
}

export function openOfficialCpgrams(
  openWindow: typeof window.open = window.open.bind(window),
): Window | null {
  const openedWindow = openWindow(OFFICIAL_CPGRAMS_URL, '_blank', 'noopener,noreferrer');
  if (openedWindow) openedWindow.opener = null;
  return openedWindow;
}

export async function continueToOfficialCpgrams(
  subject: string,
  grievance: string,
  dependencies?: {
    clipboard?: Pick<Clipboard, 'writeText'>;
    openWindow?: typeof window.open;
  },
): Promise<boolean> {
  openOfficialCpgrams(dependencies?.openWindow);
  try {
    await copyPreparedGrievance(subject, grievance, dependencies?.clipboard);
    return true;
  } catch {
    return false;
  }
}
