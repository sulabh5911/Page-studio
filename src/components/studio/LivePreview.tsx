'use client';

import React from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { PageRenderer } from '@/components/preview/PageRenderer';
import { Badge } from '@/components/ui/badge';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const modeIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const;

export function LivePreview() {
  const page = useAppSelector(state => state.draftPage.page);
  const previewMode = useAppSelector(state => state.ui.previewMode);

  if (!page) return null;

  const ModeIcon = modeIcons[previewMode];

  const widthClass =
    previewMode === 'mobile' ? 'max-w-[390px] mx-auto' :
    previewMode === 'tablet' ? 'max-w-3xl mx-auto' :
    'w-full';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-background/80 px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ModeIcon className="size-4 text-muted-foreground" aria-hidden />
          Live preview
        </div>
        <Badge variant="outline" className="capitalize">{previewMode}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_1px_1px,_oklch(0.85_0_0)_1px,_transparent_0)] bg-[length:20px_20px] p-4 md:p-6">
        <div
          className={`bg-background shadow-xl ring-1 ring-border/60 rounded-xl overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${widthClass}`}
        >
          <PageRenderer page={page} embedded />
        </div>
      </div>
    </div>
  );
}
