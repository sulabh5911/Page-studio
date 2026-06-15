import React from 'react';
import { ValidatedPage } from '@/lib/schema/page';
import { getSectionComponent } from '@/lib/registry/sectionRegistry';
import { cn } from '@/lib/utils';

interface PageRendererProps {
  page: ValidatedPage;
  embedded?: boolean;
}

export function PageRenderer({ page, embedded = false }: PageRendererProps) {
  return (
    <main
      className={cn(
        'flex flex-col items-center w-full',
        embedded ? 'min-h-0' : 'min-h-screen'
      )}
    >
      {page.sections.map((section) => {
        const SectionComponent = getSectionComponent(section.type);
        return <SectionComponent key={section.id} {...section} />;
      })}
    </main>
  );
}
