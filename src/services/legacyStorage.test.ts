import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getStoredCitizenGrievances, LEGACY_DEMO_LABEL } from './apiClient';

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function createStorage(initial: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe('legacy citizen storage compatibility', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: createStorage({}) });
  });

  afterEach(() => {
    if (originalLocalStorageDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', originalLocalStorageDescriptor);
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });

  it('preserves an explicitly stored empty array as empty', () => {
    localStorage.setItem('samadhan_citizen_grievances', '[]');
    expect(getStoredCitizenGrievances()).toEqual([]);
  });

  it('loads an existing record unchanged and adds the required legacy label', () => {
    const stored = [{
      id: 'SAM-2026-1234', title: 'Old demo', description: 'Original text', category: 'Pension',
      routedEntity: 'Labour', submittedAt: '2026-01-01', status: 'SUBMITTED', applicantName: 'Citizen',
      mobile: '0000000000', timeline: [],
    }];
    localStorage.setItem('samadhan_citizen_grievances', JSON.stringify(stored));
    const records = getStoredCitizenGrievances();
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject(stored[0]);
    expect(records[0].legacyLabel).toBe(LEGACY_DEMO_LABEL);
  });
});
