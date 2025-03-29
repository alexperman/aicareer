import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { getSessionFromCookie, setSessionCookie } from '@/lib/session-recovery';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Try to recover session from cookie if not already authenticated
  if (!req.cookies.get('sb-access-token')) {
    const session = await getSessionFromCookie(req);
    if (session) {
      setSessionCookie(res, session);
    }
  }

  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
