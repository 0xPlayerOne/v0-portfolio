import { bindings, defineConfig } from 'cf/config'

/**
 * Secret-like files were detected but not read or migrated: .env.example, .env.local. Only `secrets.required` entries are migrated.
 * @see https://developers.cloudflare.com/workers/configuration/secrets/
 */

export default defineConfig({
  accountId: 'd825b2cc4fce823f4243ca8617d1ef9b',
  worker: {
    name: 'v0-portfolio',
    compatibilityDate: '2026-08-29',
    compatibilityFlags: ['global_fetch_strictly_public'],
    entrypoint: 'worker/index.ts',
    observability: {
      enabled: true,
      headSamplingRate: 1,
    },
    assets: {
      notFoundHandling: '404-page',
      runWorkerFirst: ['/api/projects', '/api/projects/*'],
    },
    env: {
      ASSETS: bindings.assets(),
    },
  },
})
