export type Block = {
  heading: string
  body: string[]
  bullets?: { term: string; text: string }[]
}

export type CaseStudy = {
  slug: string
  title: string
  eyebrow: string
  subtitle: string
  description: string
  meta: string[]
  lede: string[]
  sections: Block[]
  techniques: string[]
  next: { slug: string; title: string }
}

export const cases: CaseStudy[] = [
  {
    slug: 'tenant-isolation',
    title: 'Tenant Isolation That Cannot Be Forgotten',
    eyebrow: 'Multi-tenant SaaS · School ERP',
    subtitle:
      'I did not want to ship a product whose safety depended on forty repository functions each remembering the same filter. So I made the filter impossible to forget.',
    description:
      'How I enforced multi-tenant data isolation in a school ERP through Mongoose middleware and AsyncLocalStorage, fail-closed by default, with named escape hatches.',
    meta: [
      'Primary engineer and architect',
      '~70,000 lines of TypeScript across 6 repos',
      '202 endpoints, 42 Mongoose models',
      'Fastify 5 · MongoDB · Next.js 15 · Expo',
    ],
    lede: [
      'I built a white-labelled ERP that many schools share. One database, one backend, and a tenantId on every document that belongs to a particular institute.',
      'The conventional way to keep two schools apart is to remember that filter in every query you write. I spent a while looking at that approach and decided I did not trust it, including from myself. One forgotten filter in one repository function leaks one school’s student records to another. That is not a bug you ship and patch on Monday. For a product that asks schools to trust it with children’s records, it is the bug that ends the product.',
      'Code review does not fix this. Neither does a lint rule, a naming convention, or a page on the wiki. Any control that depends on forty different call sites each remembering something will eventually meet the developer who is in a hurry, and that developer is sometimes me at 11pm. So I moved the guarantee somewhere that cannot forget.',
    ],
    sections: [
      {
        heading: 'I put the tenant in AsyncLocalStorage instead of in function arguments',
        body: [
          'On every authenticated request, the auth plugin stores a TenantContext of { tenantId, isSuperAdmin, bypass } in Node’s AsyncLocalStorage. It stays there for the life of that request, across every await, without anything having to carry it.',
          'The alternative I rejected was threading a tenantId parameter down through every service and repository signature. That works, right up until someone adds a new call path and the parameter is optional, or defaults to undefined, or gets passed along from a caller that never had it in the first place. The type system will not save you either, because the value is always available somewhere up the stack, so the code always compiles.',
          'Putting it in request-scoped storage means the tenant is not something a function has to be given. It is something the request already is.',
        ],
      },
      {
        heading: 'I enforced it in Mongoose middleware, not in the service layer',
        body: [
          'A plugin called tenantScopePlugin, which schemas opt into, reads that context inside query and save middleware. It injects { tenantId } into find, findOne, update*, delete* and count*, and stamps it onto save and insertMany.',
          'I could have put the check in the service layer, where it would have been easier to read. The reason I did not is that a service-layer check protects exactly the code paths you remembered to route through a service. It does nothing for the repository function someone calls directly, the aggregation written for a report, or the script that seemed too small to need a service.',
          'ORM middleware protects every query the process can issue. That includes the one written next year by someone who has never read a word of my documentation, which is the only kind of protection that actually holds up over time.',
        ],
      },
      {
        heading: 'I made the empty case return nothing instead of everything',
        body: [
          'When there is no tenant in context, for instance a platform operator whose tenantId is null, the plugin injects { tenantId: null }. In an always-scoped collection that matches nothing.',
          'The convenient implementation does the opposite. It treats a null tenant as "no filter needed" and returns everything, which means the worst-case outcome of any bug in the context plumbing is total cross-tenant disclosure. Every failure in that design points at the catastrophe.',
          'Failing closed inverts it. If I break the context plumbing, someone gets an empty list and files a confused ticket. That is a bad afternoon instead of an unrecoverable incident, and I would take that trade every time.',
        ],
      },
      {
        heading: 'I gave bypassing isolation a name so I could grep for it',
        body: [
          'Real systems need to cross the boundary. A platform admin acts on one specific institute. A background job runs per tenant. A seed script writes rows that belong to nobody. Pretending those needs do not exist just means someone invents an undocumented way around the plugin, and then the bypass is invisible.',
          'So I built two explicit wrappers and made them the only sanctioned route across the line:',
        ],
        bullets: [
          {
            term: 'runWithTenant(tenantId, fn)',
            text: 'Runs a block as one specific institute. Used by super admin actions and per-tenant jobs.',
          },
          {
            term: 'runAsSystem(fn)',
            text: 'Runs a block outside tenancy entirely. Used by seeds and crons.',
          },
        ],
      },
      {
        heading: 'I classified every collection by hand before applying the plugin',
        body: [
          'The tempting move is to apply the plugin to everything and call the problem solved. I did not, because auto-injection is actively wrong for some collections, and wrong in a way that is hard to debug.',
          'Collections like users, courses and payments legitimately span both a null tenant and a concrete one. Auto-injecting there does not leak anything; it silently hides legitimate platform rows, which surfaces later as a bug report about missing data and sends someone hunting through the wrong layer entirely.',
          'So I sorted every collection into three groups and wrote the reasoning into docs/tenant-isolation.md, because a classification nobody can reconstruct is a classification that decays:',
        ],
        bullets: [
          { term: 'Always tenant-bound', text: 'Plugin applied. The default, and the large majority.' },
          { term: 'Platform-global', text: 'Plugin never applied. These rows belong to the platform, not to a school.' },
          {
            term: 'Context-dependent',
            text: 'Scoped by hand, deliberately, with the reason recorded next to the decision.',
          },
        ],
      },
      {
        heading: 'I split the admin app in two so one bundle could not reach another tenant',
        body: [
          'The platform operator portal and the institute ERP portal started life as a single Next.js app, with access control handled by conditionals inside shared components. Two things were wrong with that. The conditionals were a maze nobody could reason about confidently, and every institute-facing bundle also shipped the cross-tenant platform screens.',
          'I split it into two applications. The ERP build now has no code path that can reach another tenant’s data, because that code is not in the bundle at all. It is the same instinct as the Mongoose plugin: turn a rule that people have to follow into a structure that holds without them.',
          'The cost is a design system duplicated across repositories. I paid it knowingly and wrote a drift-detecting sync script rather than re-merging the apps, because I would rather maintain a script than re-open a security boundary.',
        ],
      },
      {
        heading: 'I gave permissions a dependency graph, then wrote a checker for it',
        body: [
          'Isolation answers which tenant. Authorization answers which actions, and it had the same shape of problem, so it got the same shape of fix.',
          'Schools wanted real IAM rather than a handful of fixed roles: let the front office process admissions and view batches, but not touch fees. The naive checkbox grid produces incoherent grants. An admin ticks admissions.convert without batches.view, and the convert-and-enrol modal opens with two empty pickers and a pair of 403 toasts. The user does not conclude that their permissions are wrong. They conclude the product is broken.',
          'I built a catalog of 19 modules and 39 curated actions as the single source of truth, served to the admin UI so the client never holds a hard-coded copy, and put an explicit dependency graph on top of it. Grants run through expandPermissionDependencies, which adds every prerequisite. Revocations run through contractPermissionDependents, which removes anything left standing on nothing. Both run server-side on every write, and the same map ships to the grid so it ticks and unticks live. One rule, two enforcement points, and a direct API call cannot store the broken combination the UI prevents.',
          'Then there is the failure that only shows up months later. Role templates seeded before a module existed drift out of dependency closure as the catalog grows, so a template can end up granting an action whose prerequisite was added after it was written. I wrote scripts/check-acl.sh to verify that every route guard names a real catalog key, every dependency names a real key, and every role seed is dependency-closed. It exits non-zero, so it gates a deploy instead of producing a report nobody reads.',
        ],
      },
    ],
    techniques: [
      'AsyncLocalStorage request context',
      'ORM-layer policy enforcement',
      'Fail-closed defaults',
      'Explicit escape hatches',
      'Transitive closure over a permission graph',
      'Deploy-gating invariant checks',
    ],
    next: { slug: 'video-pipeline', title: 'A Video Pipeline Where the Server Never Touches the Video' },
  },
  {
    slug: 'video-pipeline',
    title: 'A Video Pipeline Where the Server Never Touches the Video',
    eyebrow: 'Media infrastructure · Video on demand',
    subtitle:
      'Getting 30 GB feature films from a browser into an HLS ladder without the API server ever holding a byte, and without paying AWS to upscale a 480p master.',
    description:
      'How I built browser-to-S3 multipart ingest with adaptive chunking and a sliding worker pool, plus an AWS MediaConvert HLS ladder with a no-upscale guard and IVS live streaming.',
    meta: [
      'Owned the ingest, transcode and live streaming path',
      '5 MB to 100 MB adaptive chunks, 10 upload workers',
      'ap-south-1 · QVBR · 10-second segments',
      'S3 · MediaConvert · AWS IVS · Fastify',
    ],
    lede: [
      'The files on this platform are feature films, which means 5 to 30 GB each, uploaded by an admin sitting in an office on an ordinary connection.',
      'Send that through the API server and every part of it goes wrong at once. The request times out. Node holds gigabytes in memory. One dropped Wi-Fi packet costs someone a forty-minute upload with no way to resume, and there is no honest progress bar to show them while it happens.',
      'Then the file lands and a second, quieter problem starts, because transcoding is a metered operation that will cheerfully bill you to produce something worse than what you gave it. This is what I built to handle both ends of that.',
    ],
    sections: [
      {
        heading: 'I moved the bytes off the API server entirely',
        body: [
          'The browser uploads directly to S3 against presigned uploadPart URLs with a four-hour TTL. The API server issues those URLs and never touches a byte of video.',
          'That single decision removes the server as a bandwidth and memory bottleneck, and it does it without putting AWS credentials in the browser, because a presigned URL is permission to write one specific part of one specific object and nothing else. The server’s job in this system is to broker permission, not to carry payload.',
        ],
      },
      {
        heading: 'I computed the chunk size instead of picking one',
        body: [
          'Chunk size is clamp(ceil(fileSize / 9999), 5 MB, 100 MB).',
          'That one expression satisfies two S3 constraints that pull in opposite directions: parts must be at least 5 MB, and there can be at most 10,000 of them. Pick a small fixed chunk size and large files blow through the part ceiling. Pick a large one and small files retry in expensive lumps.',
          'Computing it means a 500 MB file gets small chunks, so a failed part costs a small retry, while a 30 GB file scales its chunk size up automatically. Nobody has to choose a number, and no file size breaks it.',
        ],
      },
      {
        heading: 'I replaced batching with a sliding window',
        body: [
          'The obvious way to upload parts in parallel is to take them in batches of ten and await each batch. It is also wrong, because every batch finishes at the speed of its slowest chunk while nine workers sit idle waiting for it.',
          'Instead, ten persistent workers pull from a shared cursor queue, so a slow chunk never blocks anything else from starting. The first unrecoverable part error flips an aborted flag and the remaining workers stop taking new work rather than piling up requests that are already doomed.',
        ],
      },
      {
        heading: 'I gave every failure a name and an action',
        body: [
          'Uploading a 20 GB file over a real connection fails in a dozen distinct ways, and "upload failed" tells the person on the other end nothing they can act on.',
          'So failures are classified rather than caught and rethrown as strings. Each one carries an explicit action: RETRY, PAUSE, RESTART or ABORT.',
        ],
        bullets: [
          { term: 'Network drops and 5xx', text: 'Retried with backoff, three attempts per part, no human involved.' },
          {
            term: 'S3 semantic errors',
            text: 'InvalidPart, EntityTooSmall, InvalidPartOrder, NoSuchUpload, RequestTimeTooSkewed clock skew and 403 permission each surface as an actionable message, because each has a different fix.',
          },
        ],
      },
      {
        heading: 'I made an upload survive the person doing it',
        body: [
          'Every uploadId is persisted in MongoDB with its S3 key, file size and status, under a unique compound index on (movieId, uploadId). That makes an upload reconstructable rather than disposable: parts can be re-signed and the transfer resumed instead of restarted from zero.',
          'On the client, a singleton upload manager dispatches upload phases into a Redux slice, so an admin can navigate away from the upload page and keep working while a 20 GB file moves. Per-part byte progress folds into a single weighted percentage, capped at 99% until S3 actually confirms completion, because a progress bar that sits at 100% while something is still happening is a progress bar nobody believes again.',
          'The same session records paid for themselves in a way I did not anticipate when I wrote them. Abandoned multipart uploads leave parts sitting in S3, and those parts are billed indefinitely until someone aborts them. Because every session was already tracked, getIncompleteUploadSessions could find the abandoned ones and clean them up. It is a silent cost leak that no dashboard was ever going to point at.',
        ],
      },
      {
        heading: 'I stopped MediaConvert from upscaling',
        body: [
          'MediaConvert will happily take a 480p source and produce a 1080p rendition from it. You pay four times the transcode minutes and four times the storage, and what you get back is the same blurry picture, which the player then advertises to viewers as HD.',
          'It is the kind of waste that never announces itself. The job succeeds, the ladder looks complete, and the bill is just slightly larger than it should be, forever.',
          'The fix spans the whole stack. The browser reads the true source height from the video element’s loadedmetadata event before the upload starts and posts the dimensions along with the file. The job builder then filters the ladder to rendition.height <= sourceHeight, falls back to the full ladder when the dimensions are unknown, and always keeps at least one rung so a title can never end up with no renditions at all.',
        ],
      },
      {
        heading: 'I made the rendition ladder data instead of JSON',
        body: [
          'Renditions are declared in a typed table of name, width, height, maxBitrate, audioBitrate and codec, and the MediaConvert Outputs array is generated from that table. I shipped it as four rungs, 480p through 1440p.',
          'Hand-written MediaConvert JSON is long, repetitive and almost impossible to review, which means ladder changes turn into copy-paste with a bitrate edited in the wrong object. Making the ladder data means adding or retuning a rung is a row, the no-upscale filter is one comparison over a list, and codec choice per tier is just a column rather than a fork in the job builder.',
        ],
      },
      {
        heading: 'I made partial failure survivable',
        body: [
          'A title carries six assets: the movie file, a trailer, and four pieces of artwork. Originally, one failed poster rolled back the entire save, which meant a completed multi-gigabyte video upload could be destroyed by a 40 KB image.',
          'I rewrote it so each asset uploads independently and the movie file goes first, because it is the most expensive thing to redo. Failures collect into a failedFiles array, whatever succeeded is persisted, and the API responds with { partial: true, failedFiles } so the UI can show a soft warning and let the admin re-upload just the missing piece.',
          'The same principle covers the transcode. If MediaConvert job creation throws, the raw file is already safe in S3 and the job can be re-triggered, so an AWS-side hiccup never costs an upload. A companion endpoint reverts the title to DRAFT and stamps transcodingStatus FAILED, so a broken title cannot sit in the app labelled NOW SHOWING.',
        ],
      },
      {
        heading: 'I wrote one filename sanitizer and used it on both paths',
        body: [
          'Movie titles become S3 keys, and those keys become MediaConvert destination paths. Unsanitized spaces, brackets and unicode produced broken presigned signatures and unplayable playlist URLs downstream.',
          'The subtle part is not sanitizing. It is that two code paths sanitizing slightly differently is worse than neither doing it, because the upload succeeds, the transcode succeeds, and playback fails against a key that does not quite match. One sanitizer runs on both paths, so they cannot disagree.',
        ],
      },
      {
        heading: 'I waited for AWS to say ACTIVE',
        body: [
          'For live events I provisioned IVS channels with RTMPS ingest endpoints and stream keys, including tag sanitization, because IVS rejects tag values outside its charset and real event names would not create a channel until they were normalized.',
          'The trap is eventual consistency. An IVS recording configuration reports CREATING before it becomes ACTIVE, and attaching it too early fails the channel creation outright, which reads like a permissions problem and is not one. A polling loop waits for activation before proceeding.',
          'Stream lifecycle then runs off a webhook-driven state machine for start, end and failure, with defensive handling for empty payloads. Live access is checked against the same purchase model as video on demand, so a paid live event and a paid film share one access path instead of two that drift apart.',
        ],
      },
      {
        heading: 'I scoped the IAM so the uploader cannot read the library',
        body: [
          'A dedicated MediaConvert role holds s3:GetObject on raw-movies/*, s3:PutObject on transcoded-movies/*, and s3:ListBucket on the bucket. The service user holds iam:PassRole, which lets it submit jobs under that role without holding the role’s data permissions itself.',
          'The effect is that the credentials the API server carries cannot be used to read the finished catalogue. Queue and role ARNs moved out of hardcoded values into environment configuration at the same time.',
        ],
      },
    ],
    techniques: [
      'S3 presigned multipart upload',
      'Sliding-window concurrency',
      'Typed error taxonomies',
      'Graceful degradation',
      'Cost as a design constraint',
      'AWS IAM PassRole scoping',
    ],
    next: { slug: 'dispatch-engine', title: 'Dispatch as a Durable State Machine' },
  },
  {
    slug: 'dispatch-engine',
    title: 'Dispatch as a Durable State Machine',
    eyebrow: 'Distributed real-time systems · Ride-hailing',
    subtitle:
      'Matching a rider to a driver looks like a request until you build one. It is a negotiation, and a negotiation cannot live in a setTimeout.',
    description:
      'How I modelled ride dispatch as a durable BullMQ state machine with deterministic job IDs, dual termination bounds, and single-query geospatial matching.',
    meta: [
      'Sole engineer across 4 applications',
      '53 REST endpoints, 2 socket namespaces',
      '5-second offers · 5 attempts · 60-second budget',
      'Fastify · BullMQ · Redis · MongoDB · Expo',
    ],
    lede: [
      'Find the nearest driver, offer them the ride, wait a few seconds, and if they decline or go quiet, move to the next one. Repeat until someone accepts. Never hand the same ride to two drivers at once.',
      'Written out like that it sounds like a function. It is not. It is a long-running negotiation with timers in it, and the obvious implementation, a setTimeout holding the state in process memory, breaks in two specific ways I did not want to discover in production.',
      'The first deploy drops every in-flight match, because the timers die with the process. And the moment the service runs more than one replica it stops working correctly at all, since the timer lives in the memory of one pod while the acceptance can arrive at another. So I built it as something that survives both.',
    ],
    sections: [
      {
        heading: 'I made dispatch two jobs that re-enqueue each other',
        body: [
          'The whole negotiation is a BullMQ state machine living in Redis rather than in any single process.',
        ],
        bullets: [
          {
            term: 'match',
            text: 'Finds the nearest eligible driver, records them as the ride’s candidateDriverId, pushes the offer to that driver’s personal socket room, fires a push notification in parallel, and schedules a check job five seconds out.',
          },
          {
            term: 'check',
            text: 'Wakes up five seconds later and asks one question: was this accepted? If yes, it exits. If not, it clears the candidate, adds that driver to an excludedDriverIds accumulator, and enqueues the next match attempt.',
          },
        ],
      },
      {
        heading: 'I carried the state in the job payload so the worker could stay stateless',
        body: [
          'attempt, excludedDriverIds and startedAt all travel with the job rather than living in a worker. That is what makes the design survive the failures I was actually worried about: a pod can die mid-negotiation and another pod picks the job up with everything it needs to continue.',
          'It also means the workers scale horizontally without coordination, because no worker owns a particular ride. Any of them can process the next step of any negotiation.',
        ],
      },
      {
        heading: 'I keyed the jobs deterministically so a duplicate is harmless',
        body: [
          'Jobs are keyed match:{rideId}:{attempt} and check:{rideId}:{attempt}:{driverId}.',
          'The failure this prevents is the worst one in the system. A retry, a duplicate event or a race enqueues a second match for the same ride at the same attempt, two drivers receive the same offer, and both accept. Deterministic IDs make that enqueue idempotent, so the queue itself refuses the duplicate rather than my code having to detect it afterwards.',
        ],
      },
      {
        heading: 'I bounded it on two independent axes',
        body: [
          'The chain ends on acceptance, on five attempts exhausted, or on a sixty-second wall-clock budget, after which the ride auto-cancels with reason no_driver_found and the rider is told over the socket.',
          'Two bounds rather than one, because each catches a failure the other cannot. An attempt counter alone cannot stop a chain whose attempts are individually slow. A wall clock alone cannot stop a chain spinning quickly through an empty driver pool. Together they guarantee that a ride request cannot hang forever in either direction, and that the rider always gets an answer rather than a spinner.',
        ],
      },
      {
        heading: 'I made a decline cost zero seconds',
        body: [
          'An explicit decline short-circuits the wait. It clears the candidate and enqueues a fresh match immediately instead of letting the five-second timer run out.',
          'The five seconds exists to detect silence, and a driver tapping "no" is not silence. Without the short-circuit, the most common negative case makes the rider sit through a timeout designed for a completely different situation, which is five wasted seconds multiplied by every declined offer in the system.',
        ],
      },
      {
        heading: 'I made matching a single indexed query',
        body: [
          'Find the nearest available approved driver of the right vehicle class, excluding everyone who already declined. This runs repeatedly during a live match while a rider watches a loading screen, so it had to be one round trip rather than a fetch-then-filter chain in application code.',
          'Driver position is stored as a GeoJSON Point with a compound 2dsphere index on { currentLocation, status }. The lookup is one $geoNear aggregation that does distance sorting and the entire eligibility filter in a single pass: availability, an overallStatus of approved so an unverified driver can never be matched, vehicle class, a $nin exclusion list, and a 10 km radius cap. It comes back sorted nearest-first with a computed distanceMeters on each row.',
        ],
      },
      {
        heading: 'I paid for routing only after a driver said yes',
        body: [
          'Matching uses straight-line geospatial distance. The Google Directions API is called once, for display and ETA, after a driver has accepted.',
          'Routing every candidate on every attempt would have multiplied Maps spend by roughly the number of match attempts per ride. What that money buys is a slightly better ordering of drivers who are all within 10 km of the same rider, on a screen where the ordering is invisible to everyone involved. The rider cannot perceive the difference. The bill would have been very perceptible.',
        ],
      },
    ],
    techniques: [
      'Distributed job queues',
      'Delayed and re-enqueuing jobs',
      'Idempotency keys',
      'Dual termination bounds',
      'GeoJSON 2dsphere indexing',
      '$geoNear aggregation',
      'Third-party API cost control',
    ],
    next: { slug: 'tenant-isolation', title: 'Tenant Isolation That Cannot Be Forgotten' },
  },
]

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug)!
