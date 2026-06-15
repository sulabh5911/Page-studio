import { Change } from './diff';

export function calculateNextVersion(currentVersion: string | null, changes: Change[]): string | null {
  if (changes.length === 0) return null; // Idempotent publish
  if (!currentVersion) return '1.0.0'; // Initial version

  const severities = changes.map(c => c.severity);
  let [major, minor, patch] = currentVersion.split('.').map(Number);

  if (severities.includes('major')) {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (severities.includes('minor')) {
    minor += 1;
    patch = 0;
  } else if (severities.includes('patch')) {
    patch += 1;
  } else {
    return null;
  }

  return `${major}.${minor}.${patch}`;
}
