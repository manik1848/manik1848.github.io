import { useState } from 'react'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // storage can be unavailable in private mode; the toggle still works for this session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-md border hairline p-2 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
