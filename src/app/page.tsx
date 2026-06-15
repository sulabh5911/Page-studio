import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, Pencil, Rocket, ArrowRight, Sparkles } from 'lucide-react';

const roles = [
  {
    id: 'viewer',
    label: 'Viewer',
    description: 'Preview published pages only',
    icon: Eye,
    redirect: '/preview/home',
    cta: 'Sign in & preview',
  },
  {
    id: 'editor',
    label: 'Editor',
    description: 'Edit drafts in the studio',
    icon: Pencil,
    redirect: '/studio/home',
    cta: 'Sign in & edit',
  },
  {
    id: 'publisher',
    label: 'Publisher',
    description: 'Edit drafts and publish releases',
    icon: Rocket,
    redirect: '/studio/home',
    cta: 'Sign in & publish',
  },
] as const;

const features = [
  'Schema-driven sections validated with Zod',
  'Contentful adapter with draft/published modes',
  'Redux studio with live preview',
  'SemVer publishing with immutable snapshots',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <AppHeader />

      <main id="main-content" className="container mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-14">
        <section className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" aria-hidden />
            WYSIWYG-lite · Contentful · Redux · SemVer
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Build and publish landing pages with confidence
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Page Studio loads page definitions from Contentful, lets editors shape sections in a
              lightweight studio, and publishes immutable versioned releases with RBAC enforcement.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/preview/home" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
              View live preview
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/studio/home" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Open studio
            </Link>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="grid gap-3 sm:grid-cols-2">
          <h2 id="features-heading" className="sr-only">Features</h2>
          {features.map((feature) => (
            <div key={feature} className="rounded-xl border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
              {feature}
            </div>
          ))}
        </section>

        <section className="space-y-5" aria-labelledby="roles-heading">
          <div className="space-y-2">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight">
              Choose a role to get started
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              RBAC is enforced server-side via proxy middleware and the publish API. Signing in sets a
              session cookie and redirects you to the right experience.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const authUrl = `/api/auth?role=${role.id}&redirect=${encodeURIComponent(role.redirect)}`;
              return (
                <li key={role.id}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <CardTitle>{role.label}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent />
                    <CardFooter>
                      <Link href={authUrl} className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
                        {role.cta}
                      </Link>
                    </CardFooter>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
