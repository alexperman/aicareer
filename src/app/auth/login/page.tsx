import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-design-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-design-foreground">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm font-medium text-design-primary hover:text-design-primary/80">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-design-input" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-design-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full justify-center">
              <span className="sr-only">&quot;Sign in with Google&quot;</span>
              Google
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-design-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-design-primary hover:text-design-primary/80">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
