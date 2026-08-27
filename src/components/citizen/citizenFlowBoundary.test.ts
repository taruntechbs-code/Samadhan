import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('citizen flow boundary', () => {
  it('contains no simulated submission call, fake processing delay, or SAM reference generation', () => {
    const home = readSource('../../pages/HomePage.tsx');
    const modal = readSource('./GrievancePreparationModal.tsx');
    const client = readSource('../../services/apiClient.ts');
    const activeCitizenFlow = `${home}\n${modal}`;

    expect(activeCitizenFlow).not.toContain('saveCitizenGrievance');
    expect(activeCitizenFlow).not.toContain('setTimeout');
    expect(activeCitizenFlow).not.toContain('submittedRecord');
    expect(client).not.toContain('export function saveCitizenGrievance');
    expect(client).not.toContain('Math.floor(1000 + Math.random()');
  });

  it('resets the editable draft whenever the modal opens or its routed input changes', () => {
    const modal = readSource('./GrievancePreparationModal.tsx');
    expect(modal).toContain("if (!isOpen || !routing) return;");
    expect(modal).toContain('setSubject(draft.subject)');
    expect(modal).toContain('setGrievance(draft.grievance)');
    expect(modal).toContain('[grievanceText, isOpen, language, routing]');
  });
});
