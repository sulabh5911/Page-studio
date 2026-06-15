import { Role } from '@/types';

export const ROLES: Record<Role, Role> = {
  viewer: 'viewer',
  editor: 'editor',
  publisher: 'publisher',
};

export function getRoleHierarchy(role: Role): number {
  switch (role) {
    case 'publisher': return 3;
    case 'editor': return 2;
    case 'viewer': return 1;
    default: return 0;
  }
}
