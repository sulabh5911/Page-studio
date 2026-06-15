'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectSection } from '@/features/editor/uiSlice';
import { removeSection, reorderSections } from '@/features/editor/draftPageSlice';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { getSectionLabel, sectionMeta } from '@/lib/schema/sectionMeta';
import { GripVertical, Trash2, Layers } from 'lucide-react';

export function SectionList() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(state => state.draftPage.page?.sections || []);
  const selectedSectionId = useAppSelector(state => state.ui.selectedSectionId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((item) => item.id === active.id);
    const newIndex = sections.findIndex((item) => item.id === over.id);
    dispatch(reorderSections({ fromIndex: oldIndex, toIndex: newIndex }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Layers className="size-4 text-muted-foreground" aria-hidden />
          Sections
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag to reorder · Arrow keys on handle
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {sections.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            No sections yet. Use Add to insert one.
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2" role="list">
                {sections.map((section, index) => (
                  <SortableItem
                    key={section.id}
                    id={section.id}
                    type={section.type}
                    index={index}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => dispatch(selectSection(section.id))}
                    onRemove={() => dispatch(removeSection(section.id))}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

interface SortableItemProps {
  id: string;
  type: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableItem({ id, type, index, isSelected, onSelect, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const meta = sectionMeta[type];
  const Icon = meta?.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg border p-2 text-sm cursor-pointer transition-colors motion-reduce:transition-none ${
        isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-card hover:bg-muted/50'
      }`}
      onClick={onSelect}
      aria-current={isSelected ? 'true' : undefined}
    >
      <button
        type="button"
        className="rounded p-1 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Reorder ${getSectionLabel(type)}, position ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{getSectionLabel(type)}</p>
        <p className="truncate text-xs text-muted-foreground capitalize">{type}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="opacity-70 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Remove ${getSectionLabel(type)} section`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
  );
}
