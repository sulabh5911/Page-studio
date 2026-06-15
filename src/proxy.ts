import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromCookieHeader } from '@/lib/rbac/parseRole';
import { canEditDraft, canViewPreview } from '@/lib/rbac/permissions';

export function proxy(request: NextRequest) {
  const role = getRoleFromCookieHeader(request.headers.get('cookie'));

  if (request.nextUrl.pathname.startsWith('/preview')) {
    if (!canViewPreview(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/studio')) {
    if (!canEditDraft(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/preview/:path*'],
};
