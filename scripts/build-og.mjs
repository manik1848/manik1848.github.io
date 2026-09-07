// Renders the Open Graph cards in public/ from scripts/og-card.html.
// Run after editing the template or the card copy: npm run og
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const chain = (...parts) =>
  parts.map((p, i) => (i ? `<span class="sep">·</span><span>${p}</span>` : `<span>${p}</span>`)).join('')

const cards = [
  {
    out: 'og.png',
    eyebrow: 'Full-Stack Engineer',
    title: 'Manikandan Prakash',
    titleSize: '78px',
    subtitle:
      'I build the parts that are hard to fake: HLS video pipelines, real-time dispatch, multi-tenant isolation.',
    foot: chain('Node.js', 'TypeScript', 'React', 'Kafka', 'AWS'),
  },
  {
    out: 'og-tenant-isolation.png',
    eyebrow: 'Case Study · Multi-Tenant SaaS',
    title: 'Tenant Isolation That Cannot Be Forgotten',
    titleSize: '62px',
    subtitle:
      'Moving the tenant filter out of developer discipline and into the ORM, fail-closed by default.',
    foot: chain('AsyncLocalStorage', 'Mongoose', 'Fastify'),
  },
  {
    out: 'og-video-pipeline.png',
    eyebrow: 'Case Study · Media Infrastructure',
    title: 'A Video Pipeline Where the Server Never Touches the Video',
    titleSize: '54px',
    subtitle: 'Browser-to-S3 multipart ingest, an HLS ladder with a no-upscale guard, and live streaming.',
    foot: chain('S3', 'MediaConvert', 'AWS IVS'),
  },
  {
    out: 'og-dispatch-engine.png',
    eyebrow: 'Case Study · Distributed Systems',
    title: 'Dispatch as a Durable State Machine',
    titleSize: '66px',
    subtitle:
      'Ride matching that survives a pod restart, with deterministic job IDs and dual termination bounds.',
    foot: chain('BullMQ', 'Redis', '$geoNear'),
  },
]

const candidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]
const chrome = process.env.CHROME_PATH ?? candidates.find((p) => existsSync(p))
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH and re-run.')
  process.exit(1)
}

const template = readFileSync(resolve(here, 'og-card.html'), 'utf8')

for (const card of cards) {
  const html = template
    .replaceAll('{{EYEBROW}}', card.eyebrow)
    .replaceAll('{{TITLE}}', card.title)
    .replaceAll('{{TITLE_SIZE}}', card.titleSize)
    .replaceAll('{{SUBTITLE}}', card.subtitle)
    .replaceAll('{{FOOT}}', card.foot)

  const tmpHtml = resolve(here, '.og-tmp.html')
  const tmpPng = resolve(root, '.og-tmp.png')
  writeFileSync(tmpHtml, html)
  rmSync(tmpPng, { force: true })

  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    `--screenshot=${tmpPng}`,
    `file://${tmpHtml}`,
  ], { stdio: 'ignore' })

  rmSync(tmpHtml, { force: true })
  if (!existsSync(tmpPng)) {
    console.error(`Screenshot failed for ${card.out}`)
    process.exit(1)
  }
  renameSync(tmpPng, resolve(root, 'public', card.out))
  console.log(`Wrote public/${card.out}`)
}
