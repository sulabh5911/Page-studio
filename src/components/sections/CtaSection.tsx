import React from 'react';
import { CtaSection as CtaSectionProps } from '@/lib/schema/sections';

export function CtaSection({ props }: CtaSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {props.heading}
        </h2>
        {props.description && (
          <p className="mx-auto mt-4 max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-primary-foreground/90">
            {props.description}
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <a
            href={props.buttonUrl}
            className="inline-flex h-10 items-center justify-center rounded-md bg-background px-8 text-sm font-medium text-foreground shadow transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {props.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
