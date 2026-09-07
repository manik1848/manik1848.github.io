import { profile } from '../data/content'
import { DocIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons'

export default function Hero() {
  return (
    <div id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-5xl px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          {profile.role}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{profile.name}</h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">{profile.pitch}</p>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed muted">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
          >
            <MailIcon className="h-4 w-4" />
            Get in touch
          </a>
          <a
            href={`${import.meta.env.BASE_URL}${profile.resume}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-md border hairline px-4 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <DocIcon className="h-4 w-4" />
            Résumé
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

        <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs muted">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            </span>
            Available now
          </span>
          <span aria-hidden="true">·</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </div>
  )
}
