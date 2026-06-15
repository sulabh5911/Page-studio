import { cookies } from 'next/headers';
import { parseRole } from './parseRole';
import { Role } from '@/types';

export async function getServerRole(): Promise<Role> {
  const cookieStore = await cookies();
  return parseRole(cookieStore.get('user_role')?.value);
}
