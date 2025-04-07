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
