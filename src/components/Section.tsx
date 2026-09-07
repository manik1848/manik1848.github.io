import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  id: string
  index: string
  title: string
  children: ReactNode
}

/** Section shell: mono index label, rule, and a one-shot reveal on scroll. */
export default function Section({ id, index, title, children }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id={id} className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
      <header className="reveal mb-10 flex items-baseline gap-4 border-b hairline pb-4">
        <span className="font-mono text-xs muted">{index}</span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      </header>
      {children}
    </section>
  )
}
