import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#stack', label: 'Stack' },
  { href: '#open-source', label: 'Open Source' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'hairline backdrop-blur-md' : 'border-transparent'
      }`}
      style={{ backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg) 82%, transparent)' : 'transparent' }}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">
          manik<span style={{ color: 'var(--accent)' }}>.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm muted transition-colors hover:text-[var(--fg)]">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${import.meta.env.BASE_URL}${profile.resume}`}
            target="_blank"
            rel="noopener"
            className="hidden rounded-md border hairline px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:block"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
