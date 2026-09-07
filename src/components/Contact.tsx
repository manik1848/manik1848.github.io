import { profile } from '../data/content'
import Section from './Section'
import { GithubIcon, LinkedinIcon, MailIcon, NpmIcon } from './Icons'

const socials = [
  { href: profile.github, label: 'GitHub', Icon: GithubIcon },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
  { href: profile.npm, label: 'npm', Icon: NpmIcon },
]

export default function Contact() {
  return (
    <Section id="contact" index="05" title="Contact">
      <div className="reveal">
        <p className="max-w-2xl text-lg leading-relaxed">
          {profile.availability} If you are building something where the backend has to be right
          the first time, I would like to hear about it.
        </p>

        <div className="mt-8 flex flex-col gap-3 font-mono text-sm">
          <a href={`mailto:${profile.email}`} className="inline-flex w-fit items-center gap-3 transition-colors hover:text-[var(--accent)]">
            <MailIcon className="h-4 w-4" />
            {profile.email}
          </a>
          <a href={`tel:${profile.phoneHref}`} className="inline-flex w-fit items-center gap-3 transition-colors hover:text-[var(--accent)]">
            <span className="w-4 text-center" aria-hidden="true">
              ☎
            </span>
            {profile.phone}
          </a>
        </div>

        <div className="mt-8 flex gap-3">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-md border hairline p-3 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}
