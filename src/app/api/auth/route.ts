import { NextResponse } from 'next/server';
import { getRoleFromCookieHeader } from '@/lib/rbac/parseRole';

const VALID_ROLES = ['viewer', 'editor', 'publisher'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get('role');

  if (roleParam && VALID_ROLES.includes(roleParam)) {
    const redirectTo = searchParams.get('redirect') || '/';
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.set('user_role', roleParam, { path: '/', httpOnly: false, sameSite: 'lax' });
    return response;
  }

  const role = getRoleFromCookieHeader(request.headers.get('cookie'));
  return NextResponse.json({ role });
}
