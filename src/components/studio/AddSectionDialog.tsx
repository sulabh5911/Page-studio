'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setAddDialogOpen, selectSection } from '@/features/editor/uiSlice';
import { addSection } from '@/features/editor/draftPageSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sectionMeta } from '@/lib/schema/sectionMeta';

const SECTION_TEMPLATES = [
  { type: 'hero', defaultProps: { heading: 'New Hero', subheading: 'Subtitle here', ctaText: 'Learn more', ctaUrl: '#' } },
  { type: 'featureGrid', defaultProps: { features: [{ title: 'Feature 1', description: 'Description' }, { title: 'Feature 2', description: 'Description' }] } },
  { type: 'testimonial', defaultProps: { quote: 'Great product!', author: 'Jane Doe', role: 'Customer' } },
  { type: 'cta', defaultProps: { heading: 'Ready to start?', description: 'Join thousands of happy users.', buttonLabel: 'Sign Up', buttonUrl: '#' } },
];

export function AddSectionDialog() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isAddDialogOpen);

  const handleAdd = (template: (typeof SECTION_TEMPLATES)[number]) => {
    const id = `section-${Date.now()}`;
    dispatch(addSection({
      id,
      type: template.type,
      props: { ...template.defaultProps },
    }));
    dispatch(setAddDialogOpen(false));
    dispatch(selectSection(id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(setAddDialogOpen(open))}>
      <DialogContent className="sm:max-w-lg" aria-describedby="add-section-description">
        <DialogHeader>
          <DialogTitle>Add section</DialogTitle>
          <DialogDescription id="add-section-description">
            Choose a section type to append to the page. You can reorder it afterwards.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
          {SECTION_TEMPLATES.map((t) => {
            const meta = sectionMeta[t.type];
            const Icon = meta?.icon;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => handleAdd(t)}
                className="flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Icon && (
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                )}
                <span className="font-medium">{meta?.label ?? t.type}</span>
                <span className="text-xs text-muted-foreground">{meta?.description}</span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
