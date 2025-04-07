import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function CallbackPage() {
  const headersList = await headers();
  const referer = headersList.get('referer');
  const url = referer || 'http://localhost:3000/auth/callback';
  const code = new URL(url).searchParams.get('code');

  if (code) {
    const supabase = createServerComponentClient({
      cookies,
    });

    await supabase.auth.exchangeCodeForSession(code);
  }

  redirect('/');
}
