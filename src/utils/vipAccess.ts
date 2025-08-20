
import type { User } from '@supabase/supabase-js';

export const VIP_EMAILS = new Set<string>([
  'creator@hempstar.ai',
  'chidoweywey@gmail.com',
  'chidoweywey@gmail.com', // include both common variants just in case
]);

export function isVipUser(user?: User | null): boolean {
  if (!user) return false;

  const emailsToCheck = new Set<string>();

  if (typeof user.email === 'string') emailsToCheck.add(user.email.toLowerCase());
  const metaEmail = (user as any)?.user_metadata?.email;
  if (typeof metaEmail === 'string') emailsToCheck.add(metaEmail.toLowerCase());

  if (Array.isArray((user as any)?.identities)) {
    (user as any).identities.forEach((identity: any) => {
      const e = identity?.identity_data?.email;
      if (typeof e === 'string') emailsToCheck.add(e.toLowerCase());
    });
  }

  for (const e of emailsToCheck) {
    if (VIP_EMAILS.has(e)) return true;
  }
  return false;
}

export function isAllowedToSignUp(email: string): boolean {
  return VIP_EMAILS.has(email.toLowerCase());
}
