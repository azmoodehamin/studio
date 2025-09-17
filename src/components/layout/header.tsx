import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, History, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">VPN Commander</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard" aria-label="Home">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/runs" aria-label="History">
            <History className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
