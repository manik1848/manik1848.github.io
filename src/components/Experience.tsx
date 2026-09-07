import Section from './Section'
import { education, experience } from '../data/content'

export default function Experience() {
  return (
    <Section id="experience" index="02" title="Experience">
      <ol className="relative border-l hairline pl-6 sm:pl-8">
        {experience.map((job) => (
          <li key={job.company} className="reveal relative pb-10 last:pb-0">
            <span
              className="absolute top-1.5 -left-[calc(1.5rem+4.5px)] h-2 w-2 rounded-full sm:-left-[calc(2rem+4.5px)]"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-base font-semibold tracking-tight">
                {job.company} <span className="font-normal muted">· {job.title}</span>
              </h3>
              <span className="font-mono text-xs muted">
                {job.period} · {job.place}
              </span>
            </div>
            <p className="mt-1 text-sm italic muted">{job.descriptor}</p>
            <ul className="mt-3 space-y-2">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed">
                  <span aria-hidden="true" className="muted">
                    —
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="reveal mt-10 border-t hairline pt-6">
        <h3 className="font-mono text-xs tracking-widest uppercase muted">Education</h3>
        <ul className="mt-3 space-y-1">
          {education.map((e) => (
            <li key={e.title} className="text-[15px]">
              {e.title} <span className="muted">· {e.org} · {e.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
