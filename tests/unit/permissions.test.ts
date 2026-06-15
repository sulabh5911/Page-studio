import { describe, it, expect } from 'vitest';
import { canViewPreview, canEditDraft, canPublish } from '@/lib/rbac/permissions';

describe('RBAC permissions', () => {
  it('viewer can preview only', () => {
    expect(canViewPreview('viewer')).toBe(true);
    expect(canEditDraft('viewer')).toBe(false);
    expect(canPublish('viewer')).toBe(false);
  });

  it('editor can preview and edit', () => {
    expect(canViewPreview('editor')).toBe(true);
    expect(canEditDraft('editor')).toBe(true);
    expect(canPublish('editor')).toBe(false);
  });

  it('publisher has full access', () => {
    expect(canViewPreview('publisher')).toBe(true);
    expect(canEditDraft('publisher')).toBe(true);
    expect(canPublish('publisher')).toBe(true);
  });
});
