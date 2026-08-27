import { describe, expect, it, vi } from 'vitest';
import {
  continueToOfficialCpgrams,
  copyPreparedGrievance,
  formatPreparedGrievance,
  OFFICIAL_CPGRAMS_URL,
  prepareGrievance,
} from './grievancePreparation';

describe('CPGRAMS grievance preparation', () => {
  it('is stable and deterministic', () => {
    const input = {
      grievance: 'My refund has not arrived.',
      detectedCategory: 'Income Tax & Direct Taxation',
      language: 'en' as const,
    };
    expect(prepareGrievance(input)).toEqual(prepareGrievance(input));
  });

  it('preserves the complaint while normalizing whitespace only', () => {
    const prepared = prepareGrievance({
      grievance: '  My refund\n\thas not arrived.  ',
      detectedCategory: 'Income Tax & Direct Taxation',
      language: 'en',
    });
    expect(prepared.grievance).toBe('My refund has not arrived.');
    expect(prepared.subject).toBe('Grievance regarding Income Tax & Direct Taxation');
  });

  it('supports Hindi without inventing or translating complaint facts', () => {
    const complaint = 'मेरी पेंशन दो महीने से नहीं आई है।';
    const prepared = prepareGrievance({ grievance: complaint, detectedCategory: 'पेंशन', language: 'hi' });
    expect(prepared).toEqual({
      subject: 'पेंशन से संबंधित शिकायत',
      grievance: complaint,
    });
  });

  it('adds no facts, personal information, submission claim, or SAM reference', () => {
    const complaint = 'Streetlight is not working.';
    const output = prepareGrievance({ grievance: complaint, detectedCategory: 'Street Lighting', language: 'en' });
    const serialized = JSON.stringify(output);
    expect(output.grievance).toBe(complaint);
    expect(serialized).not.toMatch(/name|mobile|otp|address|submitted|SAM-2026/i);
  });

  it('copies the edited subject and grievance instead of the original draft', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyPreparedGrievance('Edited subject', 'Edited grievance', { writeText });
    expect(writeText).toHaveBeenCalledWith(formatPreparedGrievance('Edited subject', 'Edited grievance'));
    expect(writeText).not.toHaveBeenCalledWith(expect.stringContaining('original'));
  });

  it('opens the canonical official URL in a protected new tab even if clipboard copying fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const openWindow = vi.fn().mockReturnValue(null);
    const copied = await continueToOfficialCpgrams('Edited subject', 'Edited grievance', {
      clipboard: { writeText },
      openWindow,
    });
    expect(copied).toBe(false);
    expect(openWindow).toHaveBeenCalledWith(OFFICIAL_CPGRAMS_URL, '_blank', 'noopener,noreferrer');
    expect(OFFICIAL_CPGRAMS_URL).toBe('https://pgportal.gov.in');
    expect(OFFICIAL_CPGRAMS_URL).not.toContain('?');
  });

  it('creates a fresh deterministic draft when the grievance changes', () => {
    const first = prepareGrievance({ grievance: 'First complaint', detectedCategory: 'Pension', language: 'en' });
    const reset = prepareGrievance({ grievance: 'Second complaint', detectedCategory: 'Railways', language: 'en' });
    expect(reset).toEqual({ subject: 'Grievance regarding Railways', grievance: 'Second complaint' });
    expect(reset).not.toEqual(first);
  });
});
