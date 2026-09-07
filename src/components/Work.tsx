import { useState } from 'react'
import Section from './Section'
import { projects } from '../data/content'

function Card({ project }: { project: (typeof projects)[number] }) {
  const [open, setOpen] = useState(false)
  const panelId = `detail-${project.id}`

  return (
    <article className="reveal rounded-lg border hairline p-6 transition-colors hover:border-[var(--accent)]">
      <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
        {project.kind}
      </span>

      <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-1 font-mono text-xs muted">{project.context}</p>
      <p className="mt-4 text-[15px] leading-relaxed">{project.blurb}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded border hairline px-2 py-0.5 font-mono text-[11px] muted"
            style={{ backgroundColor: 'var(--bg-soft)' }}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="font-mono text-xs transition-colors hover:opacity-80"
          style={{ color: 'var(--accent)' }}
        >
          {open ? '− How it works' : '+ How it works'}
        </button>
        {project.caseHref && (
          <a
            href={`${import.meta.env.BASE_URL}${project.caseHref}`}
            className="font-mono text-xs underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            Read the case study →
          </a>
        )}
      </div>

      {open && (
        <ul id={panelId} className="mt-4 space-y-3 border-t hairline pt-4">
          {project.detail.map((d) => (
            <li key={d} className="flex gap-3 text-sm leading-relaxed muted">
              <span aria-hidden="true" style={{ color: 'var(--accent)' }}>
                ▸
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function Work() {
  return (
    <Section id="work" index="01" title="Selected Work">
      <p className="reveal mb-8 max-w-2xl text-[15px] leading-relaxed muted">
        Almost all of this lives in private company repositories, so what follows describes the
        mechanisms rather than linking the code. Every detail below is something I can walk
        through line by line.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} project={p} />
        ))}
      </div>
    </Section>
  )
}
