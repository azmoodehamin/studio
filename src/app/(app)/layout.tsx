import type { PropsWithChildren } from 'react';
import Header from '@/components/layout/header';
import Navigation from '@/components/layout/navigation';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="px-4 md:px-6 lg:px-8">
        <Navigation />
        <div className="py-8">{children}</div>
      </main>
    </div>
  );
}
