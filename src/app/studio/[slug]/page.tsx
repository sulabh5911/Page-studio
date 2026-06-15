'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loadPage, restoreDraft } from '@/features/editor/draftPageSlice';
import { StudioToolbar } from '@/components/studio/StudioToolbar';
import { SectionList } from '@/components/studio/SectionList';
import { SectionEditor } from '@/components/studio/SectionEditor';
import { LivePreview } from '@/components/studio/LivePreview';
import { fetchPageBySlug } from '@/lib/contentful/adapter';
import { loadPersistedDraft } from '@/lib/store/store';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const dispatch = useAppDispatch();
  const draftPage = useAppSelector(state => state.draftPage.page);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then(resolved => setSlug(resolved.slug));
  }, [params]);

  useEffect(() => {
    async function initializeStudio() {
      if (!slug) return;
      if (draftPage?.slug === slug) {
        setLoading(false);
        return;
      }

      const persisted = loadPersistedDraft(slug);
      if (persisted) {
        dispatch(restoreDraft(persisted));
        setLoading(false);
        return;
      }

      const pageData = await fetchPageBySlug(slug, true);
      if (!pageData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      dispatch(loadPage(pageData));
      setLoading(false);
    }
    initializeStudio();
  }, [slug, draftPage?.slug, dispatch]);

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4" role="alert">
        <p className="text-lg font-medium">Page not found</p>
        <p className="text-sm text-muted-foreground">No Contentful or mock data exists for this slug.</p>
      </div>
    );
  }

  if (loading || !draftPage) {
    return (
      <div className="flex h-screen flex-col gap-4 p-4" aria-live="polite" aria-busy="true">
        <Skeleton className="h-14 w-full rounded-lg" />
        <div className="flex flex-1 gap-4">
          <Skeleton className="w-64 rounded-lg" />
          <Skeleton className="w-80 rounded-lg" />
          <Skeleton className="flex-1 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <a
        href="#studio-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to studio content
      </a>
      <StudioToolbar page={draftPage} />
      <div id="studio-main" className="flex flex-1 overflow-hidden" role="main">
        <nav className="w-64 shrink-0 border-r bg-sidebar/50 overflow-y-auto" aria-label="Page sections">
          <SectionList />
        </nav>
        <aside className="w-80 shrink-0 border-r bg-background overflow-y-auto" aria-label="Section properties">
          <SectionEditor />
        </aside>
        <section className="flex-1 min-w-0 overflow-hidden bg-muted/30" aria-label="Live preview">
          <LivePreview />
        </section>
      </div>
    </div>
  );
}
