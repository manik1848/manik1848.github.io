import { useEffect, useRef } from 'react'
import type { CaseStudy as CaseStudyType } from '../data/cases'
import { profile } from '../data/content'
import ThemeToggle from './ThemeToggle'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons'

const base = import.meta.env.BASE_URL

const readingMinutes = (study: CaseStudyType) => {
  const words = [
    ...study.lede,
    ...study.sections.flatMap((sec) => [
      ...sec.body,
      ...(sec.bullets ?? []).map((b) => `${b.term} ${b.text}`),
    ]),
  ]
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function CaseStudy({ study }: { study: CaseStudyType }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${study.title} | Manikandan Prakash`
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [study.title])

  return (
    <div ref={root}>
      <header className="sticky top-0 z-50 border-b hairline backdrop-blur-md"
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
        <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <a href={base} className="font-mono text-sm transition-colors hover:text-[var(--accent)]">
            ← Manikandan Prakash
          </a>
          <div className="flex items-center gap-2">
            <a
              href={`${base}#work`}
              className="hidden rounded-md border hairline px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:block"
            >
              All work
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pb-24">
        <article>
          <div className="border-b hairline py-14 sm:py-20">
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              {study.eyebrow}
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
              {study.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed muted">{study.subtitle}</p>

            <p className="mt-8 font-mono text-xs leading-relaxed muted">
              {study.meta.map((m, i) => (
                <span key={m}>
                  {i > 0 && <span aria-hidden="true" className="px-2 opacity-50">·</span>}
                  {m}
                </span>
              ))}
              <span aria-hidden="true" className="px-2 opacity-50">·</span>
              {readingMinutes(study)} min read
            </p>
          </div>

          <div className="reveal border-b hairline py-10">
            {study.lede.map((p, i) => (
              <p
                key={p}
                className={
                  i === 0
                    ? 'text-[19px] leading-[1.7] font-medium'
                    : 'mt-5 text-[17px] leading-[1.75]'
                }
              >
                {p}
              </p>
            ))}
          </div>

          <nav aria-label="On this page" className="reveal border-b hairline py-8">
            <h2 className="font-mono text-[11px] tracking-widest uppercase muted">Contents</h2>
            <ol className="mt-3 space-y-1.5">
              {study.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slugify(s.heading)}`} className="text-sm transition-colors hover:text-[var(--accent)]">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {study.sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)} className="reveal pt-12">
              <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p} className="mt-4 text-[17px] leading-[1.75]">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <dl className="mt-6 space-y-4 border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
                  {section.bullets.map((b) => (
                    <div key={b.term}>
                      <dt className="font-mono text-sm font-medium">{b.term}</dt>
                      <dd className="mt-1 text-[15px] leading-relaxed muted">{b.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}

          <section className="reveal pt-14">
            <h2 className="font-mono text-[11px] tracking-widest uppercase muted">Techniques</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {study.techniques.map((t) => (
                <li
                  key={t}
                  className="rounded border hairline px-2.5 py-1 font-mono text-[12px]"
                  style={{ backgroundColor: 'var(--bg-soft)' }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>

        </article>

        <nav className="mt-16 flex flex-col gap-4 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a href={`${base}#work`} className="font-mono text-sm muted transition-colors hover:text-[var(--accent)]">
            ← All work
          </a>
          <a
            href={`${base}case/${study.next.slug}/`}
            className="group text-right transition-colors hover:text-[var(--accent)]"
          >
            <span className="font-mono text-[11px] tracking-widest uppercase muted">Next case study</span>
            <span className="mt-1 block text-sm font-medium">{study.next.title} →</span>
          </a>
        </nav>

        <div className="mt-16 rounded-lg border hairline p-6">
          <p className="text-[15px] leading-relaxed">
            {profile.availability} If you want the version of this with the code open in front of us,
            I am happy to walk through it.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
            >
              <MailIcon className="h-4 w-4" />
              Get in touch
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-md border hairline p-2.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <GithubIcon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-md border hairline p-2.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto w-full max-w-3xl px-6 py-8 font-mono text-xs muted">
          © {new Date().getFullYear()} {profile.name}
        </div>
      </footer>
    </div>
  )
}
