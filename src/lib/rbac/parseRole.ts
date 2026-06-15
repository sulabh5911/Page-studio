import { Role } from '@/types';

const VALID_ROLES: Role[] = ['viewer', 'editor', 'publisher'];

export function parseRole(value: string | undefined | null): Role {
  if (value && VALID_ROLES.includes(value as Role)) {
    return value as Role;
  }
  return 'viewer';
}

export function getRoleFromCookieHeader(cookieHeader: string | null): Role {
  const match = cookieHeader?.match(/user_role=([^;]+)/);
  return parseRole(match?.[1]);
}
