import Section from './Section'
import { openSource } from '../data/content'

export default function OpenSource() {
  return (
    <Section id="open-source" index="04" title="Open Source">
      <div className="grid gap-5 sm:grid-cols-2">
        {openSource.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group rounded-lg border hairline p-6 transition-colors hover:border-[var(--accent)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-mono text-sm font-medium break-all">{item.name}</h3>
              <span className="font-mono text-[11px] muted">{item.tag} ↗</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed muted">{item.blurb}</p>
          </a>
        ))}
      </div>
    </Section>
  )
}
