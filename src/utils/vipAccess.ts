
import type { User } from '@supabase/supabase-js';

// Secure VIP email list - only authorized users
export const VIP_EMAILS = new Set<string>([
  'creator@hempstar.ai',
  'chidoweywey@gmail.com',
]);

export function isVipUser(user?: User | null): boolean {
  if (!user) return false;

  // Enhanced validation with multiple fallbacks
  const emailsToCheck = new Set<string>();

  // Primary email check
  if (typeof user.email === 'string' && user.email.length > 0) {
    emailsToCheck.add(user.email.toLowerCase().trim());
  }

  // Metadata email check (for OAuth)
  const metaEmail = (user as any)?.user_metadata?.email;
  if (typeof metaEmail === 'string' && metaEmail.length > 0) {
    emailsToCheck.add(metaEmail.toLowerCase().trim());
  }

  // Identity data check (for social logins)
  if (Array.isArray((user as any)?.identities)) {
    (user as any).identities.forEach((identity: any) => {
      const identityEmail = identity?.identity_data?.email;
      if (typeof identityEmail === 'string' && identityEmail.length > 0) {
        emailsToCheck.add(identityEmail.toLowerCase().trim());
      }
    });
  }

  // Check against VIP list
  for (const email of emailsToCheck) {
    if (VIP_EMAILS.has(email)) {
      // Additional security: log VIP access
      console.log('🛡️ VIP access granted for:', email);
      return true;
    }
  }

  // Log unauthorized access attempts
  const attemptedEmails = Array.from(emailsToCheck);
  if (attemptedEmails.length > 0) {
    console.warn('🛡️ Unauthorized access attempt:', attemptedEmails);
  }

  return false;
}

export function isAllowedToSignUp(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length === 0) {
    return false;
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  // Enhanced email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    console.warn('🛡️ Invalid email format attempted:', email);
    return false;
  }

  const isAllowed = VIP_EMAILS.has(normalizedEmail);
  
  if (!isAllowed) {
    console.warn('🛡️ Unauthorized signup attempt:', normalizedEmail);
  }

  return isAllowed;
}

// New function to validate user session security
export function validateUserSession(user: User): boolean {
  if (!user || !user.id) return false;
  
  // Check if user ID is a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(user.id)) {
    console.error('🛡️ Invalid user ID format');
    return false;
  }

  // Check session age (optional - reject very old sessions)
  const sessionAge = Date.now() - new Date(user.created_at).getTime();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  
  if (sessionAge > maxAge) {
    console.warn('🛡️ Session too old, re-authentication recommended');
  }

  return true;
}
