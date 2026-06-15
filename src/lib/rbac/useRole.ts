'use client';

import { useEffect, useState } from 'react';
import { Role } from '@/types';
import { parseRole } from './parseRole';

export function useRole(): Role {
  const [role, setRole] = useState<Role>('viewer');

  useEffect(() => {
    const match = document.cookie.match(/user_role=([^;]+)/);
    setRole(parseRole(match?.[1]));
  }, []);

  return role;
}
