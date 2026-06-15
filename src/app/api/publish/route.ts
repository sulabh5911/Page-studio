import { NextResponse } from 'next/server';
import { Page } from '@/types';
import { diffPages } from '@/lib/publish/diff';
import { calculateNextVersion } from '@/lib/publish/semver';
import { getLastSnapshot, saveSnapshot } from '@/lib/publish/snapshot';
import { canPublish } from '@/lib/rbac/permissions';
import { getRoleFromCookieHeader } from '@/lib/rbac/parseRole';
import { pageSchema } from '@/lib/schema/page';

export async function POST(request: Request) {
  try {
    const role = getRoleFromCookieHeader(request.headers.get('cookie'));
    if (!canPublish(role)) {
      return NextResponse.json({ error: 'Unauthorized. Publisher role required.' }, { status: 403 });
    }

    const { page } = await request.json() as { page: Page };

    const parsed = pageSchema.safeParse(page);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid page schema', details: parsed.error.format() }, { status: 400 });
    }

    const newPage = parsed.data;
    const lastSnapshot = await getLastSnapshot(newPage.slug);

    const changes = diffPages(lastSnapshot?.page || null, newPage);

    if (changes.length === 0) {
      return NextResponse.json({
        version: lastSnapshot?.version ?? null,
        changelog: ['No changes detected'],
        status: 'unchanged',
      });
    }

    const nextVersion = calculateNextVersion(lastSnapshot?.version || null, changes);
    if (!nextVersion) {
      return NextResponse.json({ error: 'Failed to calculate version' }, { status: 500 });
    }

    const changelog = changes.map(c => c.description);
    await saveSnapshot(newPage.slug, nextVersion, newPage, changelog);

    return NextResponse.json({
      success: true,
      version: nextVersion,
      changelog,
      status: 'published',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Publish error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
