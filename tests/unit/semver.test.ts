import { describe, it, expect } from 'vitest';
import { calculateNextVersion } from '@/lib/publish/semver';
import { Change } from '@/lib/publish/diff';

describe('calculateNextVersion', () => {
  it('returns 1.0.0 for initial version', () => {
    const changes: Change[] = [{ severity: 'minor', description: 'initial' }];
    expect(calculateNextVersion(null, changes)).toBe('1.0.0');
  });

  it('returns null if no changes', () => {
    expect(calculateNextVersion('1.0.0', [])).toBe(null);
  });

  it('bumps major version on major severity', () => {
    const changes: Change[] = [
      { severity: 'patch', description: 'prop update' },
      { severity: 'major', description: 'removed section' }
    ];
    expect(calculateNextVersion('1.2.3', changes)).toBe('2.0.0');
  });

  it('bumps minor version on minor severity', () => {
    const changes: Change[] = [
      { severity: 'patch', description: 'prop update' },
      { severity: 'minor', description: 'added section' }
    ];
    expect(calculateNextVersion('1.2.3', changes)).toBe('1.3.0');
  });

  it('bumps patch version on patch severity', () => {
    const changes: Change[] = [
      { severity: 'patch', description: 'prop update' },
      { severity: 'patch', description: 'another update' }
    ];
    expect(calculateNextVersion('1.2.3', changes)).toBe('1.2.4');
  });
});
