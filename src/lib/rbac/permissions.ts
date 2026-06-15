import { Role } from '@/types';
import { getRoleHierarchy } from './roles';

export function canViewPreview(role: Role): boolean {
  return getRoleHierarchy(role) >= 1;
}

export function canEditDraft(role: Role): boolean {
  return getRoleHierarchy(role) >= 2;
}

export function canPublish(role: Role): boolean {
  return getRoleHierarchy(role) >= 3;
}
