import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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

export async function getSessionFromCookie(
  req: NextRequest,
  options: Partial<SessionRecoveryOptions> = {}
) {
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
    if (!session || session.expires_at === undefined || session.expires_at <= Date.now() / 1000) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error recovering session:', error);
    return null;
  }
}

export function setSessionCookie(
  res: NextResponse,
  session: { access_token: string; refresh_token: string; expires_at: number },
  options: Partial<SessionRecoveryOptions> = {}
) {
  const config = { ...defaultOptions, ...options };
  const expires = new Date(Date.now() + config.maxAge * 1000);

  // Get the current cookies from the response
  const cookies = res.cookies;
  
  // Set the new cookie
  cookies.set(config.cookieName, session.access_token, {
    ...config.cookieOptions,
    expires,
  });

  // Return the updated cookies
  return cookies;
}

export function clearSessionCookie(
  res: NextResponse,
  options: Partial<SessionRecoveryOptions> = {}
) {
  const config = { ...defaultOptions, ...options };
  
  // Get the current cookies from the response
  const cookies = res.cookies;
  
  // Clear the cookie
  cookies.set(config.cookieName, '', {
    ...config.cookieOptions,
    expires: new Date(0),
  });

  // Return the updated cookies
  return cookies;
}
