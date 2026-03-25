import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPath?: string;
}

export function Header({ currentPath = '' }: HeaderProps) {
  const navLinks = [
    { href: '/', label: 'Blog' },
    { href: '/about/', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 text-base font-bold text-squirrel-800 dark:text-text-primary hover:text-squirrel-600 transition-colors">
        Gareth Hughes
      </Link>

      <nav className="flex items-center gap-1 ml-4">
        {navLinks.map(({ href, label }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surface-active text-squirrel-700'
                  : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
