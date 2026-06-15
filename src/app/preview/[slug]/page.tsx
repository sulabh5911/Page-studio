import Link from 'next/link';
import { fetchPageBySlug } from '@/lib/contentful/adapter';
import { getLastSnapshot } from '@/lib/publish/snapshot';
import { PageRenderer } from '@/components/preview/PageRenderer';
import { pageSchema } from '@/lib/schema/page';
import { notFound } from 'next/navigation';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppHeader } from '@/components/layout/AppHeader';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params;

  const release = await getLastSnapshot(resolvedParams.slug);
  const pageData = release?.page ?? await fetchPageBySlug(resolvedParams.slug, false);

  if (!pageData) {
    notFound();
  }

  const parsedPage = pageSchema.safeParse(pageData);

  if (!parsedPage.success) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader showStudioLink />
        <div className="container mx-auto py-12 px-4">
          <div
            className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <h1 className="text-2xl font-bold mb-4">Invalid Page Data</h1>
            <p className="mb-4">The data for this page failed schema validation.</p>
            <pre className="bg-background p-4 rounded text-sm overflow-auto">
              {JSON.stringify(parsedPage.error.format(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showStudioLink />
      <div className="border-b bg-muted/30">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Published preview</p>
            <h1 className="text-lg font-semibold">{parsedPage.data.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {release ? (
              <Badge variant="secondary">v{release.version}</Badge>
            ) : (
              <Badge variant="outline">Contentful draft</Badge>
            )}
            <Link
              href={`/studio/${resolvedParams.slug}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              <Pencil className="size-3.5" />
              Edit in studio
            </Link>
          </div>
        </div>
      </div>
      <ErrorBoundary>
        {release && (
          <div className="sr-only" aria-live="polite">
            Showing published release version {release.version}
          </div>
        )}
        <PageRenderer page={parsedPage.data} />
      </ErrorBoundary>
    </div>
  );
}
