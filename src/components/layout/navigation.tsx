'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Server,
  UserPlus,
  FileText,
  PlayCircle,
  BarChart,
  Settings,
  Bot,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/servers', label: 'Servers', icon: Server },
  { href: '/enroll', label: 'Enroll', icon: UserPlus },
  { href: '/plans', label: 'Plans', icon: FileText },
  { href: '/runs', label: 'Runs', icon: PlayCircle },
  { href: '/metrics', label: 'Metrics', icon: BarChart },
  { href: '/hardening-plan', label: 'Hardening', icon: ShieldCheck },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center pt-4">
      <nav className="flex items-center gap-1 rounded-full bg-card/50 p-1.5 backdrop-blur-sm">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-center gap-x-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none md:px-4 md:py-2',
                isActive
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
