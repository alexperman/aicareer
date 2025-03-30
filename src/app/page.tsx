import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to AICareer</h1>
        <p className="text-muted-foreground mb-8">Your AI-powered career management platform</p>
        <Link href="/auth/login" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Get Started
        </Link>
      </div>
    </div>
  );
}
