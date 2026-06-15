'use client';

import { Badge } from '@/components/ui/badge';
import { useRole } from '@/lib/rbac/useRole';
import { canPublish, canEditDraft } from '@/lib/rbac/permissions';

const roleVariant = {
  viewer: 'secondary',
  editor: 'outline',
  publisher: 'default',
} as const;

export function RoleBadge() {
  const role = useRole();

  return (
    <Badge variant={roleVariant[role]} className="capitalize" aria-label={`Current role: ${role}`}>
      {role}
      {canPublish(role) ? ' · can publish' : canEditDraft(role) ? ' · can edit' : ' · preview only'}
    </Badge>
  );
}
