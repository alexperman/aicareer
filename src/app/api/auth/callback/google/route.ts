'use server';

import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
