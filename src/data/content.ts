export const profile = {
  name: 'Manikandan Prakash',
  shortName: 'Manikandan P',
  role: 'Full-Stack Engineer',
  tagline: 'Node.js · TypeScript · React · Event-Driven Systems',
  pitch:
    'I build the parts that are hard to fake: HLS video pipelines, real-time dispatch, multi-tenant isolation.',
  summary:
    'Close to four years building production systems on Node.js/TypeScript and React. Depth in event-driven backends (Kafka, BullMQ, MQTT, WebSockets), multi-tenant SaaS architecture, and AWS media infrastructure. Most of my work sits at the seams: where a queue meets a state machine, where a tenant boundary has to fail closed, where a multi-gigabyte upload has to survive a flaky connection.',
  location: 'Open to Remote or Bengaluru, India',
  availability: 'Immediate joiner. Open to remote SDE-2 roles.',
  email: 'manikprakash1848@gmail.com',
  phone: '+91 88388 86279',
  phoneHref: '+918838886279',
  github: 'https://github.com/manik1848',
  linkedin: 'https://www.linkedin.com/in/manikandanprakash1848',
  npm: 'https://www.npmjs.com/package/@manik1848/react-date-range-picker',
  resume: 'Manikandan_P_FullStack_Engineer_Resume.pdf',
} as const

export type Project = {
  id: string
  title: string
  kind: string
  context: string
  blurb: string
  detail: string[]
  stack: string[]
  caseHref?: string
}

export const projects: Project[] = [
  {
    id: 'erp',
    caseHref: 'case/tenant-isolation/',
    title: 'Multi-Tenant School ERP',
    kind: 'Multi-tenant SaaS',
    context: 'Gravitorix · 6 repos · ~70k lines of TypeScript',
    blurb:
      'A white-labelled ERP built end to end: a Fastify/MongoDB backend of 202 endpoints across 42 models, three Next.js 15 portals, and an Expo mobile app.',
    detail: [
      'Tenant scoping is enforced inside Mongoose middleware backed by an AsyncLocalStorage request context. It is fail-closed by default, with named and auditable escape hatches, which replaces per-query developer discipline with a structural guarantee.',
      'A dependency-closed IAM system spanning 19 permission modules, 39 actions and 13 role templates, applying transitive grant-expansion and revoke-contraction identically in the admin UI and server-side on every write.',
      'A deploy-gating invariant checker that catches permission-graph drift as the catalog grows, plus a fee engine that absorbs rounding remainders so instalment splits always reconcile to the total.',
    ],
    stack: ['Fastify', 'MongoDB', 'Next.js 15', 'Expo', 'AsyncLocalStorage', 'Turborepo'],
  },
  {
    id: 'ott',
    caseHref: 'case/video-pipeline/',
    title: 'OTT Video Ingest and Live Streaming',
    kind: 'Media infrastructure',
    context: 'Client engagement · commercial VOD platform',
    blurb:
      'The ingest and transcode path for a production video platform, from the browser upload all the way to an HLS ladder and live channels.',
    detail: [
      'Browser-to-S3 presigned multipart upload with adaptive 5 to 100 MB chunking and a 10-worker sliding-window pool, removing the API server as a bandwidth and memory bottleneck for multi-gigabyte film files. Sessions are resumable and orphaned S3 parts are cleaned up automatically.',
      'AWS MediaConvert HLS jobs generated from a typed rendition ladder, with a no-upscale guard: source resolution is probed in the browser and any rendition that would upscale it is filtered out before the job is submitted, cutting wasted transcode minutes and storage.',
      'AWS IVS live streaming end to end, including RTMPS channel provisioning, polling for asynchronous recording-config activation, and a webhook-driven event state machine.',
    ],
    stack: ['AWS S3', 'MediaConvert', 'AWS IVS', 'Node.js', 'HLS'],
  },
  {
    id: 'dispatch',
    caseHref: 'case/dispatch-engine/',
    title: 'Ride-Hailing Dispatch Engine',
    kind: 'Distributed real-time systems',
    context: 'Gravitorix · driver matching and offer lifecycle',
    blurb:
      'A durable BullMQ state machine that survives pod restarts where an in-process timer could not.',
    detail: [
      'Geospatial driver matching through a compound 2dsphere index, with 5-second offer timeouts and decline-driven re-matching backed by an exclusion accumulator.',
      'Termination is bounded on two independent axes, attempt count and wall clock, so a request can never spin forever against an empty driver pool.',
      'Supporting work included dual-mode background location on React Native and debugging a silent WebSocket upgrade failure through an APISIX gateway.',
    ],
    stack: ['BullMQ', 'Redis', 'MongoDB $geoNear', 'Socket.IO', 'React Native'],
  },
  {
    id: 'expense',
    title: 'Event-Driven Expense Intelligence',
    kind: 'Fintech pipelines',
    context: 'Neokred · B2B2C expense management',
    blurb:
      'Raw user messages in on Kafka, structured transactions and category-level spending analytics out.',
    detail: [
      'Ingested raw user messages onto Kafka and integrated an ML inference service across two topics, persisting the structured transactions that power category-level spending analytics.',
      'Response caching and explicit failure handling across the asynchronous pipeline, so a slow or failed inference call degrades the feature rather than the platform.',
    ],
    stack: ['Apache Kafka', 'Node.js', 'MongoDB', 'Redis'],
  },
  {
    id: 'switch',
    title: 'UPI Switch Reporting and Terminal Management',
    kind: 'Fintech platform',
    context: 'Neokred · merchant reporting and device fleet',
    blurb:
      'Million-record Excel reports that never block the event loop, and backend services for a payment-device fleet of roughly 100,000 terminals.',
    detail: [
      'Merchant transaction reports of up to roughly 1,000,000 records generated with BullMQ background jobs, Node.js worker threads, MongoDB cursors and streamed Excel writes, delivered by email.',
      'A Terminal Management System covering inventory, merchant-device assignment and firmware-version visibility across soundboxes, POS and MPOS devices.',
      'Bulk device ingestion from Excel with BullMQ processing and WebSocket real-time progress, plus per-record validation that produces a downloadable error sheet for correction and re-upload. Fastify services publish to MQTT topics driving payment-confirmation announcements on soundboxes in the field.',
    ],
    stack: ['BullMQ', 'Worker threads', 'MQTT', 'Fastify', 'WebSockets'],
  },
  {
    id: 'vto',
    title: 'AI Virtual Try-On',
    kind: 'Applied AI',
    context: 'Gravitorix · client platform',
    blurb:
      'The project I am proudest of for what I threw away rather than what I kept.',
    detail: [
      'Measured a first-pass MediaPipe pose-warp renderer at roughly 30% believable output, then drove the pivot to a diffusion model on Google Vertex AI and reached roughly 95% client-validated accuracy.',
      'Repurposed the discarded MediaPipe work as a client-side pose-validity gate, so unusable photos never reach the paid inference API.',
    ],
    stack: ['Next.js 15', 'Fastify', 'Vertex AI', 'MediaPipe'],
  },
]

export type Job = {
  company: string
  title: string
  period: string
  place: string
  descriptor: string
  points: string[]
}

export const experience: Job[] = [
  {
    company: 'Gravitorix Technologies',
    title: 'Software Engineer',
    period: 'May 2026 - Present',
    place: 'Remote',
    descriptor: 'Services company. Platform engineering across multiple client products.',
    points: [
      'Architected and built a multi-tenant, white-labelled school ERP end to end across 6 repositories.',
      'Built a distributed driver-dispatch engine for a ride-hailing platform as a durable BullMQ state machine.',
      'Delivered an AI virtual try-on platform on Next.js, Fastify and Google Vertex AI.',
    ],
  },
  {
    company: 'Neokred Technologies',
    title: 'Software Development Engineer, Full-Stack',
    period: 'Nov 2023 - Apr 2026',
    place: 'Bengaluru',
    descriptor: 'Fintech and Banking-as-a-Service platform.',
    points: [
      'Built the event-driven expense-processing pipeline on Kafka with an integrated ML inference service.',
      'Owned merchant transaction reporting in a UPI Switch platform, generating million-record Excel exports off the event loop.',
      'Built backend services for a Terminal Management System tracking roughly 100,000 payment devices, and integrated Fastify services with MQTT topics driving soundbox announcements.',
    ],
  },
  {
    company: 'Intugine Technologies',
    title: 'Software Development Engineer I',
    period: 'Nov 2022 - Nov 2023',
    place: 'Bengaluru',
    descriptor: 'Logistics visibility platform.',
    points: [
      'Developed features for Control Tower, a server-driven UI platform giving logistics teams network-wide shipment visibility.',
      'Owned the company web presence: migrated the CMS from Ghost to WordPress with no content loss, integrated HubSpot, and improved Core Web Vitals across web and mobile.',
    ],
  },
]

export const stack: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript (ES2022)', 'Node.js', 'Python', 'Bash'] },
  {
    group: 'Backend',
    items: ['Fastify', 'Express', 'REST API design', 'Microservices', 'Socket.IO', 'Worker threads', 'OpenAPI', 'Zod', 'JWT', 'TOTP MFA'],
  },
  {
    group: 'Data & Messaging',
    items: ['MongoDB', 'Mongoose', 'Redis', 'Apache Kafka', 'MQTT', 'BullMQ'],
  },
  {
    group: 'Frontend',
    items: ['React 19', 'Next.js 15', 'TanStack Query', 'Zustand', 'Redux Toolkit', 'Tailwind CSS', 'Radix UI'],
  },
  { group: 'Mobile', items: ['React Native', 'Expo (SDK 54)', 'Expo Router'] },
  {
    group: 'Cloud & DevOps',
    items: ['AWS S3', 'MediaConvert', 'IVS', 'ECR', 'SES', 'IAM', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Nginx'],
  },
  {
    group: 'Architecture',
    items: ['Multi-tenant SaaS', 'RBAC/IAM design', 'Finite state machines', 'Distributed job orchestration', 'Graceful degradation'],
  },
]

export const openSource = [
  {
    name: '@manik1848/react-date-range-picker',
    href: 'https://www.npmjs.com/package/@manik1848/react-date-range-picker',
    blurb:
      'A published React date-range picker supporting preset ranges plus absolute, relative and "now"-anchored selection modes.',
    tag: 'npm',
  },
  {
    name: 'monorepo-bp',
    href: 'https://github.com/manik1848/monorepo-bp',
    blurb:
      'A Turborepo and pnpm reference monorepo wiring Fastify v5, Next.js 15 and Expo together with end-to-end type-safe APIs.',
    tag: 'GitHub',
  },
]

export const education = [
  { title: 'B.Tech, Textile Technology', org: 'Anna University', year: '2021' },
  { title: 'MERN Full-Stack Program', org: 'Masai School', year: '2022' },
]
