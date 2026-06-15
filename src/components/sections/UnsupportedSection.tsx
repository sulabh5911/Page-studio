import React from 'react';

interface UnsupportedSectionProps {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

export function UnsupportedSection(section: UnsupportedSectionProps) {
  // We can render this in development/studio, but maybe hide in production
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return null;
  }

  return (
    <section className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="border border-destructive bg-destructive/10 text-destructive rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Unsupported Section</h3>
          <p className="text-sm">
            The section type <strong>{section.type}</strong> is not supported by the current registry.
          </p>
          <pre className="mt-4 text-left bg-background/50 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(section, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}
