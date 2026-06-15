import { Page, ReleaseSnapshot } from '@/types';
import fs from 'fs/promises';
import path from 'path';

const RELEASES_DIR = path.join(process.cwd(), 'releases');

export async function getLastSnapshot(slug: string): Promise<ReleaseSnapshot | null> {
  const dir = path.join(RELEASES_DIR, slug);
  try {
    const files = await fs.readdir(dir);
    if (files.length === 0) return null;
    
    // Simple semver sort (assumes x.y.z format)
    files.sort((a, b) => {
      const vA = a.replace('.json', '').split('.').map(Number);
      const vB = b.replace('.json', '').split('.').map(Number);
      for (let i = 0; i < 3; i++) {
        if (vA[i] !== vB[i]) return vA[i] - vB[i];
      }
      return 0;
    });

    const latest = files[files.length - 1];
    const data = await fs.readFile(path.join(dir, latest), 'utf-8');
    return JSON.parse(data) as ReleaseSnapshot;
  } catch (error) {
    // Directory might not exist
    return null;
  }
}

export async function saveSnapshot(slug: string, version: string, page: Page, changelog: string[]) {
  const dir = path.join(RELEASES_DIR, slug);
  await fs.mkdir(dir, { recursive: true });

  const snapshot: ReleaseSnapshot = {
    version,
    timestamp: new Date().toISOString(),
    page,
    changelog,
  };

  const filePath = path.join(dir, `${version}.json`);
  await fs.writeFile(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
}
