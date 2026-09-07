import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Experience from './components/Experience'
import Stack from './components/Stack'
import OpenSource from './components/OpenSource'
import Contact from './components/Contact'
import { profile } from './data/content'

export default function App() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:border focus:px-3 focus:py-2 focus:text-sm"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        Skip to content
      </a>

      <Nav />
      <main>
        <Hero />
        <Work />
        <Experience />
        <Stack />
        <OpenSource />
        <Contact />
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8 font-mono text-xs muted">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React, Vite and Tailwind. Deployed on GitHub Pages.</span>
        </div>
      </footer>
    </>
  )
}
