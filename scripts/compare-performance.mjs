import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { command, startServer, runsFrom, measure, summarize, saveSummary, enforce } from './performance-harness.mjs'

const { values } = parseArgs({ options: {
  base: { type: 'string', default: 'a3c43a0abe578513b338ea253c167c9776e89b13' },
  head: { type: 'string', default: 'HEAD' },
  runs: { type: 'string', default: '3' },
  'base-url': { type: 'string' },
  'head-url': { type: 'string' },
  output: { type: 'string', default: 'artifacts/performance/comparison' },
} })
const count = runsFrom(values.runs)
const directory = resolve(values.output)
const root = process.cwd()
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ASTRO_TELEMETRY_DISABLED: '1', WRANGLER_SEND_METRICS: 'false' }
const servers = []
const worktrees = []
let temporary

function capture(executable, args, cwd = root) {
  const result = spawnSync(executable, args, { cwd, env, encoding: 'utf8' })
  if (result.error || result.status !== 0) throw result.error || new Error(result.stderr)
  return result.stdout.trim()
}
function revision(ref) {
  if (!/^[\w][\w./-]*$/.test(ref)) throw new Error('Invalid Git ref')
  return capture('git', ['rev-parse', '--verify', `${ref}^{commit}`])
}
function externalUrl(value) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an HTTP(S) URL without embedded credentials')
  return url.href
}

try {
  let beforeUrl, afterUrl
  const metadata = { node: process.version, bun: capture('bun', ['--version']), mode: 'cloudflare-local', base: null, head: null, buildMs: {} }
  if (values['base-url'] || values['head-url']) {
    if (!values['base-url'] || !values['head-url']) throw new Error('Provide both --base-url and --head-url')
    beforeUrl = externalUrl(values['base-url'])
    afterUrl = externalUrl(values['head-url'])
    metadata.mode = 'deployed-urls'
  } else {
    metadata.base = revision(values.base)
    metadata.head = revision(values.head)
    temporary = await mkdtemp(join(tmpdir(), 'portfolio-performance-'))
    const fixture = JSON.parse(capture('bun', ['-e', "import {FALLBACK_PINNED_REPOS as a,FALLBACK_POPULAR_REPOS as b,MAX_PROJECTS as n} from './constants/github'; console.log(JSON.stringify([...a,...b].slice(0,n)))"]))
    for (const [label, sha] of [['before', metadata.base], ['after', metadata.head]]) {
      const cwd = join(temporary, label)
      await command('git', ['worktree', 'add', '--detach', cwd, sha], { cwd: root, env })
      worktrees.push(cwd)
      const path = join(cwd, 'lib/github.ts')
      const source = await readFile(path, 'utf8')
      const signature = 'export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {'
      if (!source.includes(signature)) throw new Error(`${label}: project loader changed; update the benchmark fixture injector`)
      // Only disposable worktrees are patched. Both builds get identical data;
      // no GitHub timing, rate limits, or changing star counts affect the result.
      await writeFile(path, source.replace(signature, `${signature}\n  const benchmarkFixture = ${JSON.stringify(fixture)}\n  if (benchmarkFixture.length > 0) return benchmarkFixture\n`))
      await command('bun', ['install', '--frozen-lockfile'], { cwd, env })
      const began = Date.now()
      await command('bun', ['run', 'cloudflare:build'], { cwd, env })
      metadata.buildMs[label] = Date.now() - began
      const server = await startServer(cwd, label === 'before' ? 4318 : 4319)
      servers.push(server)
      if (label === 'before') beforeUrl = server.url
      else afterUrl = server.url
    }
  }
  const samples = { before: [], after: [] }
  for (let iteration = 1; iteration <= count; iteration++) {
    // Alternate order to reduce drift from shared-runner load. Each Lighthouse
    // invocation gets a fresh Chrome profile; do not compare warm to cold loads.
    const order = iteration % 2 ? ['before', 'after'] : ['after', 'before']
    for (const label of order) samples[label].push(await measure(label === 'before' ? beforeUrl : afterUrl, directory, label, iteration))
  }
  const before = summarize(samples.before)
  const after = summarize(samples.after)
  const delta = Object.fromEntries(Object.keys(before).map((key) => [key, after[key] - before[key]]))
  const markdown = '# Next.js → Astro performance comparison\n\n' +
    `Mode: ${metadata.mode}. Runs per version: ${count}. Values are medians; raw Lighthouse reports accompany this summary.\n\n` +
    '| Metric | Before | After | Delta |\n| --- | ---: | ---: | ---: |\n' +
    Object.keys(before).map((key) => `| ${key} | ${before[key].toFixed(2)} | ${after[key].toFixed(2)} | ${delta[key].toFixed(2)} |`).join('\n') +
    '\n\nINP is not measured by this navigation audit. Build timings are informational. Review browser-interaction tests and screenshots before merging.\n'
  await saveSummary(directory, { metadata, beforeUrl, afterUrl, samples, before, after, delta }, markdown)
  console.log(markdown)
  enforce(after)
} finally {
  for (const server of servers) server.close()
  for (const cwd of worktrees) {
    // These paths were created above; no user worktree is reset or deleted.
    await command('git', ['worktree', 'remove', '--force', cwd], { cwd: root }).catch(console.error)
  }
  if (temporary) await rm(temporary, { recursive: true, force: true })
}
