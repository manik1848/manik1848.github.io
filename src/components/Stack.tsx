import Section from './Section'
import { stack } from '../data/content'

export default function Stack() {
  return (
    <Section id="stack" index="03" title="Stack">
      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {stack.map((group) => (
          <div key={group.group} className="reveal">
            <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              {group.group}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded border hairline px-2.5 py-1 text-[13px]"
                  style={{ backgroundColor: 'var(--bg-soft)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
