import React from 'react';
import { FeatureGridSection as FeatureGridSectionProps } from '@/lib/schema/sections';

export function FeatureGridSection({ props }: FeatureGridSectionProps) {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {props.features.map((feature, i) => (
            <article
              key={i}
              className="flex flex-col gap-2 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              {feature.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
