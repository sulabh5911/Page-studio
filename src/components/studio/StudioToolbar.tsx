'use client';

import React from 'react';
import Link from 'next/link';
import { Page } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loadPage, saveDraft } from '@/features/editor/draftPageSlice';
import { setAddDialogOpen, setPreviewMode } from '@/features/editor/uiSlice';
import { AddSectionDialog } from './AddSectionDialog';
import { PublishDialog } from './PublishDialog';
import { RoleBadge } from '@/components/layout/RoleBadge';
import { useRole } from '@/lib/rbac/useRole';
import { canEditDraft } from '@/lib/rbac/permissions';
import { clearPersistedDraft } from '@/lib/store/store';
import { fetchPageBySlug } from '@/lib/contentful/adapter';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Save,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface StudioToolbarProps {
  page: Page;
}

const previewModes = [
  { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
  { id: 'tablet' as const, label: 'Tablet', icon: Tablet },
  { id: 'mobile' as const, label: 'Mobile', icon: Smartphone },
];

export function StudioToolbar({ page }: StudioToolbarProps) {
  const dispatch = useAppDispatch();
  const role = useRole();
  const isDirty = useAppSelector(state => state.draftPage.isDirty);
  const previewMode = useAppSelector(state => state.ui.previewMode);
  const lastSaved = useAppSelector(state => state.draftPage.lastSaved);

  if (!canEditDraft(role)) {
    return null;
  }

  const handleResetFromContentful = async () => {
    clearPersistedDraft();
    const fresh = await fetchPageBySlug(page.slug, true);
    if (!fresh) {
      toast.error('Could not reload page from Contentful.');
      return;
    }
    dispatch(loadPage(fresh));
    toast.success('Draft reset to latest Contentful data.');
  };

  return (
    <header className="flex flex-col gap-2 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'shrink-0')}
          aria-label="Back to home"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Studio</p>
          <h1 className="truncate text-base font-semibold">{page.title}</h1>
        </div>
        <RoleBadge />
        {isDirty ? (
          <span className="hidden rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 sm:inline" aria-live="polite">
            Unsaved
          </span>
        ) : lastSaved ? (
          <span className="hidden text-xs text-muted-foreground sm:inline">Saved</span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Studio actions">
        <div className="flex items-center rounded-lg border p-0.5" role="group" aria-label="Preview device size">
          {previewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={previewMode === mode.id ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => dispatch(setPreviewMode(mode.id))}
                aria-pressed={previewMode === mode.id}
                aria-label={mode.label}
                title={mode.label}
              >
                <Icon className="size-4" />
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetFromContentful}
          aria-label="Reset draft from Contentful"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden md:inline">Reset</span>
        </Button>

        <Link
          href={`/preview/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <ExternalLink className="size-3.5" />
          Preview
        </Link>

        <Button variant="outline" size="sm" onClick={() => dispatch(setAddDialogOpen(true))}>
          <Plus className="size-3.5" />
          Add
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch(saveDraft())}
          disabled={!isDirty}
        >
          <Save className="size-3.5" />
          Save
        </Button>

        <PublishDialog />
      </div>
      <AddSectionDialog />
    </header>
  );
}
