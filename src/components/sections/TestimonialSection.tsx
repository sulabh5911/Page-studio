import React from 'react';
import { TestimonialSection as TestimonialSectionProps } from '@/lib/schema/sections';

export function TestimonialSection({ props }: TestimonialSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
            <p className="text-xl font-medium leading-relaxed sm:text-2xl">
              &quot;{props.quote}&quot;
            </p>
          </blockquote>
          <div className="mt-8">
            <div className="text-lg font-semibold">{props.author}</div>
            {props.role && (
              <div className="text-sm text-muted-foreground">{props.role}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
