import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'bun:test'

const { scripts } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

// Resolve this repository's simple && script aliases without executing a build.
function commands(name, parents = []) {
  assert.ok(scripts[name], `Missing script ${name}`)
  assert.ok(!parents.includes(name), `Recursive script ${name}`)
  return scripts[name].split(' && ').flatMap((command) => {
    const alias = /^bun run ([\w:-]+)$/.exec(command)
    return alias ? commands(alias[1], [...parents, name]) : [command]
  })
}
const builds = (tasks) => tasks.filter((command) => command === 'astro build').length
const artifacts = (tasks) =>
  tasks.filter((command) => command === 'bun scripts/check-performance-artifacts.mjs').length
const audits = (tasks) =>
  tasks.filter((command) => command === 'bun scripts/audit-performance.mjs').length

test('Foundry discovers one self-contained deterministic artifact check', () => {
  const tasks = commands('performance:check')
  assert.equal(builds(tasks), 1)
  assert.equal(artifacts(tasks), 1)
  assert.equal(audits(tasks), 0)
  assert.ok(tasks.includes('wrangler deploy --dry-run --outdir .worker-build'))
  assert.ok(tasks.every((task) => !/lighthouse|playwright|bunx|npx/.test(task)))
})

test('integration retains browser lab validation without repeating artifact budgets', () => {
  const tasks = commands('test:integration')
  assert.equal(builds(tasks), 1)
  assert.equal(artifacts(tasks), 0)
  assert.equal(audits(tasks), 1)
})

test('the canary runs one build and each audit exactly once', () => {
  const tasks = commands('canary:check')
  assert.equal(builds(tasks), 1)
  assert.equal(artifacts(tasks), 1)
  assert.equal(audits(tasks), 1)
  assert.ok(tasks.indexOf('astro build') < tasks.indexOf('bun scripts/audit-performance.mjs'))
})

test('canary preserves formatting, lint, types and coverage checks', () => {
  const tasks = commands('canary:check')
  assert.ok(tasks.includes('oxfmt --check .'))
  assert.ok(tasks.includes('oxlint'))
  assert.ok(tasks.includes('astro check'))
  assert.ok(tasks.includes('bun test --coverage --dom --isolate --max-concurrency=1'))
})

test('ordinary builds still enforce the repository-owned artifact budgets', () => {
  assert.equal(artifacts(commands('build')), 1)
})

test('performance and canary entrypoints cannot deploy or upload a Worker', () => {
  for (const name of ['performance:check', 'test:integration', 'canary:check']) {
    for (const task of commands(name)) {
      assert.notEqual(task, 'wrangler deploy')
      assert.notEqual(task, 'wrangler versions upload')
    }
  }
})
