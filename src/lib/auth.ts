import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

interface SignInParams {
  user: any;
  isNewUser: boolean;
}

export const authConfig = {
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      scope: 'email profile openid',
      params: {
        response_type: 'code',
        access_type: 'offline',
        redirect_uri: `${window.location.origin}/auth/callback`,
      },
      token: {
        endpoint: 'https://oauth2.googleapis.com/token',
        format: 'json',
      },
    },
  ],
  callbacks: {
    async signIn({ user, isNewUser }: SignInParams) {
      return true;
    },
  },
};

export const createServerSupabaseClient = () => {
  return createServerComponentClient({
    auth: authConfig,
  })
}

export const createClientSupabaseClient = () => {
  return createClientComponentClient({
    auth: authConfig,
  })
}
