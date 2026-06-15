import Link from 'next/link';
import { RoleBadge } from './RoleBadge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutPanelLeft } from 'lucide-react';

interface AppHeaderProps {
  showStudioLink?: boolean;
  showPreviewLink?: boolean;
}

export function AppHeader({ showStudioLink = true, showPreviewLink = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutPanelLeft className="size-4" aria-hidden />
          </span>
          Page Studio
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <RoleBadge />
          {showPreviewLink && (
            <Link href="/preview/home" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}>
              Preview
            </Link>
          )}
          {showStudioLink && (
            <Link href="/studio/home" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Studio
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
