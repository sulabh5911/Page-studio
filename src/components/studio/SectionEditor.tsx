'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateSectionProps } from '@/features/editor/draftPageSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sectionEditorFields } from '@/lib/schema/editorFields';
import { getSectionLabel, sectionMeta } from '@/lib/schema/sectionMeta';
import { Settings2, MousePointerClick } from 'lucide-react';

export function SectionEditor() {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector(state => state.ui.selectedSectionId);
  const section = useAppSelector(state =>
    state.draftPage.page?.sections.find(s => s.id === selectedSectionId)
  );

  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
        <MousePointerClick className="size-8 opacity-40" aria-hidden />
        <p className="text-sm">Select a section from the list to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (key: string, value: string) => {
    dispatch(updateSectionProps({ id: section.id, props: { [key]: value } }));
  };

  const fields = sectionEditorFields[section.type] ?? [];
  const meta = sectionMeta[section.type];
  const Icon = meta?.icon ?? Settings2;

  const features = (section.props.features as Array<{ title: string; description?: string }>) || [];

  const updateFeature = (index: number, key: 'title' | 'description', value: string) => {
    const next = features.map((feature, i) =>
      i === index ? { ...feature, [key]: value } : feature
    );
    dispatch(updateSectionProps({ id: section.id, props: { features: next } }));
  };

  const addFeature = () => {
    dispatch(updateSectionProps({
      id: section.id,
      props: { features: [...features, { title: 'New feature', description: '' }] },
    }));
  };

  const removeFeature = (index: number) => {
    dispatch(updateSectionProps({
      id: section.id,
      props: { features: features.filter((_, i) => i !== index) },
    }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold">{getSectionLabel(section.type)}</h2>
            <p className="text-xs text-muted-foreground">{meta?.description ?? 'Edit section content'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.key === 'subheading' || field.key === 'description' ? (
              <Textarea
                id={field.key}
                value={(section.props[field.key] as string) || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={3}
              />
            ) : field.key === 'quote' ? (
              <Textarea
                id={field.key}
                value={(section.props[field.key] as string) || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={4}
              />
            ) : (
              <Input
                id={field.key}
                type={field.type === 'url' ? 'url' : 'text'}
                value={(section.props[field.key] as string) || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                aria-required={field.key === 'heading'}
              />
            )}
          </div>
        ))}

        {section.type === 'featureGrid' && (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium">Features</legend>
            {features.map((feature, index) => (
              <div key={index} className="space-y-2 rounded-lg border bg-muted/20 p-3">
                <div className="space-y-2">
                  <Label htmlFor={`feature-title-${index}`}>Title</Label>
                  <Input
                    id={`feature-title-${index}`}
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`feature-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`feature-desc-${index}`}
                    value={feature.description || ''}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  aria-label={`Remove feature ${index + 1}`}
                >
                  Remove feature
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full">
              Add feature
            </Button>
          </fieldset>
        )}
      </div>
    </div>
  );
}
