'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { saveDraft } from '@/features/editor/draftPageSlice';
import { setPublishError, setPublishResult, setStatus } from '@/features/publish/publishSlice';
import { canPublish } from '@/lib/rbac/permissions';
import { useRole } from '@/lib/rbac/useRole';
import { toast } from 'sonner';

export function PublishDialog() {
  const dispatch = useAppDispatch();
  const role = useRole();
  const page = useAppSelector(state => state.draftPage.page);
  const publishState = useAppSelector(state => state.publish);
  const [open, setOpen] = useState(false);

  if (!canPublish(role)) {
    return null;
  }

  const handlePublish = async () => {
    if (!page) return;

    dispatch(setStatus('publishing'));
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Publish failed');
      }

      if (data.status === 'unchanged') {
        dispatch(setPublishResult({ version: data.version ?? 'unchanged', changelog: data.changelog }));
        toast.info('No changes detected — version unchanged.');
      } else {
        dispatch(setPublishResult({ version: data.version, changelog: data.changelog }));
        dispatch(saveDraft());
        toast.success(`Published version ${data.version}`);
      }
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error publishing page.';
      dispatch(setPublishError(message));
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" aria-label="Publish page" />}>
        Publish
      </DialogTrigger>
      <DialogContent aria-describedby="publish-description">
        <DialogHeader>
          <DialogTitle>Publish Page</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p id="publish-description" className="text-sm text-muted-foreground">
            Publishing creates an immutable release. SemVer is computed automatically from draft changes.
          </p>
          {publishState.lastPublishedVersion && (
            <p className="text-sm">
              Last published: <strong>{publishState.lastPublishedVersion}</strong>
            </p>
          )}
          {publishState.changelog.length > 0 && (
            <ul className="text-sm list-disc pl-5 space-y-1" aria-label="Last publish changelog">
              {publishState.changelog.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <Button
            onClick={handlePublish}
            className="w-full"
            disabled={publishState.status === 'publishing'}
            aria-busy={publishState.status === 'publishing'}
          >
            {publishState.status === 'publishing' ? 'Publishing…' : 'Confirm Publish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
