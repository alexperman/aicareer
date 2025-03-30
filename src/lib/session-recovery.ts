import { createClient } from '@supabase/supabase-js';

export interface SessionRecoveryOptions {
  maxAge: number;
  cookieName: string;
  cookieOptions: {
    path: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
  };
}

const defaultOptions: SessionRecoveryOptions = {
  maxAge: 7 * 24 * 60 * 60, // 7 days
  cookieName: 'aicareer_session',
  cookieOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

interface SessionType {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SessionResponseType {
  data: { session: SessionType | null };
  error: Error | null;
}

export async function getSessionFromCookie(
  req: { cookies: { get: (name: string) => { value: string } | undefined } },
  options: Partial<SessionRecoveryOptions> = {}
): Promise<SessionResponseType | null> {
  const config = { ...defaultOptions, ...options };
  const sessionToken = req.cookies.get(config.cookieName)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or anon key is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    // Verify the session is still valid
    if (!session || session.expires_at === undefined || session.expires_at < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Ensure we have a proper SessionType
    const typedSession: SessionType = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at!
    };

    return { data: { session: typedSession }, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { data: { session: null }, error: error as Error };
  }
}

export async function setSessionCookie(
  res: { cookies: { set: (name: string, value: string, options: { path: string; httpOnly: boolean; secure: boolean; sameSite: 'lax' | 'strict' | 'none'; maxAge: number; }) => void } },
  session: SessionType,
  options: Partial<SessionRecoveryOptions> = {}
): Promise<typeof res> {
  const config = { ...defaultOptions, ...options };
  
  res.cookies.set(config.cookieName, session.access_token, {
    ...config.cookieOptions,
    maxAge: config.maxAge,
  });

  return res;
}

export async function clearSessionCookie(
  res: { cookies: { delete: (name: string, options: { path: string; }) => void } },
  options: Partial<SessionRecoveryOptions> = {}
): Promise<typeof res> {
  const config = { ...defaultOptions, ...options };
  
  res.cookies.delete(config.cookieName, {
    path: config.cookieOptions.path,
  });

  return res;
}
