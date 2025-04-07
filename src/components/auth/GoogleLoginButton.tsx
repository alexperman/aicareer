'use client';

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { supabase } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile openid',
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full justify-center gap-2"
    >
      <GoogleIcon className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}
