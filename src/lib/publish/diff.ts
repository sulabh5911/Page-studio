import { Page, Section } from '@/types';

export type ChangeSeverity = 'patch' | 'minor' | 'major' | 'none';

export interface Change {
  severity: ChangeSeverity;
  description: string;
}

export function diffPages(oldPage: Page | null, newPage: Page): Change[] {
  if (!oldPage) {
    return [{ severity: 'minor', description: 'Initial publish' }];
  }

  const changes: Change[] = [];
  const oldSections = oldPage.sections;
  const newSections = newPage.sections;

  const oldMap = new Map<string, Section>(oldSections.map(s => [s.id, s]));
  const newMap = new Map<string, Section>(newSections.map(s => [s.id, s]));

  // Detect removed sections
  for (const oldId of oldMap.keys()) {
    if (!newMap.has(oldId)) {
      changes.push({ severity: 'major', description: `Removed section: ${oldMap.get(oldId)?.type}` });
    }
  }

  // Detect added and modified sections
  for (const newSection of newSections) {
    const oldSection = oldMap.get(newSection.id);
    if (!oldSection) {
      changes.push({ severity: 'minor', description: `Added section: ${newSection.type}` });
    } else {
      if (oldSection.type !== newSection.type) {
        changes.push({ severity: 'major', description: `Changed section type from ${oldSection.type} to ${newSection.type}` });
      } else {
        const propChanges = diffProps(oldSection.props, newSection.props);
        if (propChanges) {
          changes.push({ severity: 'patch', description: `Updated props in ${newSection.type} section` });
        }
      }
    }
  }

  // Detect reordering
  const oldOrder = oldSections.filter(s => newMap.has(s.id)).map(s => s.id);
  const newOrder = newSections.filter(s => oldMap.has(s.id)).map(s => s.id);
  if (JSON.stringify(oldOrder) !== JSON.stringify(newOrder)) {
    changes.push({ severity: 'patch', description: 'Reordered sections' });
  }

  return changes;
}

function diffProps(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): boolean {
  return JSON.stringify(oldProps) !== JSON.stringify(newProps);
}
