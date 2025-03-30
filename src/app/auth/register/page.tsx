import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RegistrationForm } from "@/components/auth/RegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-design-system-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-design-system-foreground">
            Create your account
          </h2>
        </div>
        <div className="mt-8">
          <RegistrationForm />
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-design-system-input" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-design-system-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full justify-center">
              <span className="sr-only">Sign up with Google</span>
              Google
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-design-system-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-design-system-primary hover:text-design-system-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
