import React from 'react';
import { HeroSection as HeroSectionProps } from '@/lib/schema/sections';

export function HeroSection({ props }: HeroSectionProps) {
  return (
    <section className="w-full bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 lg:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
            {props.heading}
          </h1>
          {props.subheading && (
            <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
              {props.subheading}
            </p>
          )}
          {props.ctaText && props.ctaUrl && (
            <a
              href={props.ctaUrl}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {props.ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
