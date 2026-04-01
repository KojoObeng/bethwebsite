'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Home', href: '/' },
  { name: 'Reggae Quarterly', href: '/reggae-quarterly' },
  { name: 'Books', href: '/books' },
  { name: 'Photographs', href: '/photographs' },
  { name: 'Witness to Reggae', href: '/witness-to-reggae' },
  { name: 'Music', href: '/music' },
  { name: 'Links', href: '/links' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#3A6652] border-b border-[#C8A200]/30 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ul className="flex justify-center overflow-x-auto gap-0">
          {tabs.map((tab) => {
            // Exact match for Home, prefix match for the rest
            const isActive =
              tab.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(tab.href);
            return (
              <li key={tab.href} className="flex-shrink-0">
                <Link
                  href={tab.href}
                  className={`block px-4 sm:px-5 py-3.5 text-sm tracking-[0.14em] uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[#C8A200] text-[#E8CC7A] font-semibold'
                      : 'border-transparent text-[#E8DCC5]/75 hover:text-[#E8CC7A] hover:border-[#C8A200]/50'
                  }`}
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
